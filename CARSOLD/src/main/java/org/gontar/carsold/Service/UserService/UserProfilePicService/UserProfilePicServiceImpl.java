package org.gontar.carsold.Service.UserService.UserProfilePicService;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.ErrorHandler.ErrorHandler;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserProfilePicServiceImpl implements UserProfilePicService {

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository repository;
    private final JwtService jwtService;
    private final ErrorHandler errorHandler;

    public UserProfilePicServiceImpl(UserRepository repository, JwtService jwtService, ErrorHandler errorHandler) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.errorHandler = errorHandler;
    }

    //sends profile pic
    @Override
    public String getProfilePic(HttpServletRequest request) {
        User user = jwtService.extractUserFromRequest(request);
        return user != null ? user.getProfilePic() : null;
    }

    //checks for profilePic sensitive content and then uploads profilePic to cloud
    @Override
    public boolean uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request) {
        try {
            if (!isValidImage(file)) return errorHandler.logBoolean("Could not upload, this is not an image");
            if (file.getSize() > 3 * 1024 * 1024) return errorHandler.logBoolean("Could not upload, image is too large");
            if (isImageSensitive(file)) return errorHandler.logBoolean("Could not upload, image contains sensitive content");

            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                String profilePicLink = uploadProfilePic(file, user.getUsername());
                if (profilePicLink == null) return errorHandler.logBoolean("Could not upload image to the cloud");
                user.setProfilePic(profilePicLink);
                repository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error uploading profile picture: " + e.getMessage());
        }
    }

    //checks if file is an image based on its magic number (signature)
    private boolean isValidImage(MultipartFile file) {
        try {
            byte[] fileBytes = file.getBytes();

            //for PNG image (Magic number: 89 50 4E 47 0D 0A 1A 0A)
            if (fileBytes[0] == (byte) 0x89 && fileBytes[1] == (byte) 0x50 &&
                    fileBytes[2] == (byte) 0x4E && fileBytes[3] == (byte) 0x47 &&
                    fileBytes[4] == (byte) 0x0D && fileBytes[5] == (byte) 0x0A &&
                    fileBytes[6] == (byte) 0x1A && fileBytes[7] == (byte) 0x0A) {
                return true;
            }

            //for JPEG/JPG image (Magic number: FF D8 FF)
            if (fileBytes[0] == (byte) 0xFF && fileBytes[1] == (byte) 0xD8 && fileBytes[2] == (byte) 0xFF) {
                return true;
            }

            //for WEBP image (Magic number: 52 49 46 46 followed by 57 45 42 50)
            return fileBytes[0] == (byte) 0x52 && fileBytes[1] == (byte) 0x49 &&
                    fileBytes[2] == (byte) 0x46 && fileBytes[3] == (byte) 0x46 &&
                    fileBytes[4] == (byte) 0x57 && fileBytes[5] == (byte) 0x45 &&
                    fileBytes[6] == (byte) 0x42 && fileBytes[7] == (byte) 0x50;
        } catch (Exception e) {
            return errorHandler.logBoolean("Couldn't recognize image type");
        }
    }

    //uploads image to Google Cloud
    private String uploadProfilePic(MultipartFile file, String username) {
        try {
            String fileName = username + "/" + username + ".profilePic";

            Storage storage = StorageOptions.getDefaultInstance().getService();
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            storage.create(blobInfo, file.getBytes());

            return String.format("https://storage.googleapis.com/%s/%s?timestamp=%d", bucketName, fileName, System.currentTimeMillis());
        } catch (Exception e) {
            return errorHandler.logString("Couldn't upload pic to cloud");
        }
    }

    //checks if image contains sensitive content
    private boolean isImageSensitive(MultipartFile file) {
        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            ByteString imgBytes = ByteString.copyFrom(file.getBytes());
            Image img = Image.newBuilder().setContent(imgBytes).build();

            Feature feature = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .build();

            BatchAnnotateImagesRequest batchRequest = BatchAnnotateImagesRequest.newBuilder()
                    .addRequests(request)
                    .build();

            BatchAnnotateImagesResponse batchResponse = vision.batchAnnotateImages(batchRequest);
            AnnotateImageResponse response = batchResponse.getResponsesList().getFirst();
            SafeSearchAnnotation safeSearch = response.getSafeSearchAnnotation();

            //uses SafeSearch values ("possibly" sensitive content)
            return (safeSearch.getAdultValue() >= 3 ||
                    safeSearch.getViolenceValue() >= 3 ||
                    safeSearch.getRacyValue() >= 3);
        } catch (Exception e) {
            return errorHandler.logBoolean("Couldn't check image sensitivity");
        }
    }

    //deletes profile pic in cloud and repository
    @Override
    public boolean deleteProfilePic(HttpServletRequest request) {
        try {
            User user = jwtService.extractUserFromRequest(request);
            if (user != null) {
                String fileName = user.getUsername() + "/" + user.getUsername() + ".profilePic";
                Storage storage = StorageOptions.getDefaultInstance().getService();
                BlobId blobId = BlobId.of(bucketName, fileName);
                boolean deleteResult = storage.delete(blobId);
                if (!deleteResult) return errorHandler.logBoolean("Couldn't delete pic from cloud");
                user.setProfilePic(null);
                repository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return errorHandler.logBoolean("Error deleting profile picture: " + e.getMessage());
        }
    }
}

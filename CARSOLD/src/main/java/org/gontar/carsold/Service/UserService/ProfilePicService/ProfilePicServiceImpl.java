package org.gontar.carsold.Service.UserService.ProfilePicService;

import com.google.cloud.storage.*;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.gontar.carsold.Exception.CustomException.*;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfilePicServiceImpl implements ProfilePicService {

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository repository;
    private final MyUserDetailsService userDetailsService;

    public ProfilePicServiceImpl(UserRepository repository, MyUserDetailsService userDetailsService) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public String fetchProfilePic() {
        User user = userDetailsService.loadUser();
        return user != null ? user.getProfilePic() : null;
    }

    @Override
    public void uploadProfilePic(MultipartFile file) {
        try {
            if (!isImageValid(file)) throw new MediaNotSupportedException("This is not an acceptable image");
            if (file.getSize() > 3 * 1024 * 1024) throw new MediaNotSupportedException("Image is too large");
            if (isImageSensitive(file)) throw new InappropriateContentException("Image contains sensitive content");

            User user = userDetailsService.loadUser();

            String profilePicLink = uploadToStorage(file, user.getUsername());

            user.setProfilePic(profilePicLink);
            repository.save(user);
        } catch (IOException | ExternalCheckException e) {
            throw new ImageUploadException("Problem with checking image: " + e.getMessage());
        } catch (StorageException e) {
            throw new ImageUploadException("Problem with Google Cloud: " + e.getMessage());
        }
    }

    private boolean isImageValid(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        //PNG
        if (fileBytes[0] == (byte) 0x89 && fileBytes[1] == (byte) 0x50 &&
                fileBytes[2] == (byte) 0x4E && fileBytes[3] == (byte) 0x47 &&
                fileBytes[4] == (byte) 0x0D && fileBytes[5] == (byte) 0x0A &&
                fileBytes[6] == (byte) 0x1A && fileBytes[7] == (byte) 0x0A) {

            return true;
        }
        //JPEG/JPG
        if (fileBytes[0] == (byte) 0xFF && fileBytes[1] == (byte) 0xD8 && fileBytes[2] == (byte) 0xFF) {
            return true;
        }
        //WEBP
        return fileBytes[0] == (byte) 0x52 && fileBytes[1] == (byte) 0x49 &&
                fileBytes[2] == (byte) 0x46 && fileBytes[3] == (byte) 0x46 &&
                fileBytes[4] == (byte) 0x57 && fileBytes[5] == (byte) 0x45 &&
                fileBytes[6] == (byte) 0x42 && fileBytes[7] == (byte) 0x50;
    }

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
            throw new ExternalCheckException("Google Cloud Vision error: " + e.getMessage());
        }
    }

    private String uploadToStorage(MultipartFile file, String username) throws StorageException, IOException {
        String fileName = username + "/profilePic/profilePic";
        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/%s/%s?timestamp=%d", bucketName, fileName, System.currentTimeMillis());
    }

    @Override
    public void deleteProfilePic() {
        User user = userDetailsService.loadUser();
        try {
            String fileName = user.getUsername() + "/profilePic/profilePic";
            Storage storage = StorageOptions.getDefaultInstance().getService();
            BlobId blobId = BlobId.of(bucketName, fileName);
            storage.delete(blobId);

            user.setProfilePic(null);
            repository.save(user);
        } catch (StorageException e) {
            throw new ExternalDeleteException("Failed to delete profile pic in Google Cloud: " + e.getMessage());
        }
    }
}

package org.gontar.carsold.Service.UserService.UserProfilePicService;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class UserProfilePicServiceImpl implements UserProfilePicService{

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final UserRepository repository;
    private final JwtService jwtService;

    public UserProfilePicServiceImpl(UserRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    //sends profile pic
    @Override
    public String getProfilePic(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        if (token != null) {
            String username = jwtService.extractUsername(token);
            User user = repository.findByUsername(username);
            return user.getProfilePic();
        }
        return null;
    }

    //checks for profilePic sensitive content and then uploads profilePic to cloud
    @Override
    public String uploadProfilePicWithSafeSearch(MultipartFile file, HttpServletRequest request) throws IOException {

        if (file.getSize() > 3 * 1024 * 1024) {
            return "Could not upload, image is too large.";
        }
        if (isImageSensitive(file)) {
            return "Could not upload, image contains sensitive content.";
        }

        String token = jwtService.extractTokenFromCookie(request);
        String username = jwtService.extractUsername(token);
        User user = repository.findByUsername(username);
        user.setProfilePic(uploadProfilePic(file, username));
        repository.save(user);

        return null;
    }

    //uploads image to Google Cloud
    private String uploadProfilePic(MultipartFile file, String username) throws IOException {

        String fileName = username + "/" + username + ".profilePic";

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/%s/%s?timestamp=%d", bucketName, fileName, System.currentTimeMillis());
    }

    //checks if image contains sensitive content
    private boolean isImageSensitive(MultipartFile file) throws IOException {
        ByteString imgBytes = ByteString.copyFrom(file.getBytes());

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
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

            //uses SafeSearch values
            return (safeSearch.getAdultValue() >= 3 ||
                    safeSearch.getViolenceValue() >= 3 ||
                    safeSearch.getRacyValue() >= 3);
        }
    }

    //deletes profile pic in cloud and repository
    @Override
    public void deleteProfilePic(HttpServletRequest request) {
        String token = jwtService.extractTokenFromCookie(request);
        String username = jwtService.extractUsername(token);

        String fileName = username + "/" + username + ".profilePic";

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);

        storage.delete(blobId);

        User user = repository.findByUsername(username);
        user.setProfilePic(null);
        repository.save(user);
    }

}

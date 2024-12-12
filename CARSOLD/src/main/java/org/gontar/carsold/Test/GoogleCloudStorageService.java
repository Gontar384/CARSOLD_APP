package org.gontar.carsold.Test;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Config.JwtConfig.JwtService;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class GoogleCloudStorageService {


    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private static final long MAX_FILE_SIZE = 3 * 1024 * 1024;

    public GoogleCloudStorageService(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public String uploadFileWithSafeSearch(MultipartFile file, HttpServletRequest request) throws Exception {

        if (file.getSize() > MAX_FILE_SIZE) {
            return "Could not upload, image is too large.";
        }
        if (isImageSensitive(file)) {
            return "Could not upload, image contains sensitive content.";
        }

        String token = jwtService.extractTokenFromCookie(request);
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username);
        user.setProfilePic(uploadFile(file, username));
        userRepository.save(user);

        return null;
    }

    // Upload the image to Google Cloud Storage
    private String uploadFile(MultipartFile file, String username) throws IOException {

        // Example dynamic folder name
        String fileName = username + "/ProfilePic/" + file.getOriginalFilename();

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName); // Using folder name as part of the file path
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, file.getBytes());

        // Return the URL to the uploaded file
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
    }

    private boolean isImageSensitive(MultipartFile file) throws IOException {
        ByteString imgBytes = ByteString.copyFrom(file.getBytes());

        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {
            Image img = Image.newBuilder().setContent(imgBytes).build();

            // Set up SafeSearch detection request
            Feature feature = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .build();

            // Perform SafeSearch detection using batchAnnotateImages (correct method)
            BatchAnnotateImagesRequest batchRequest = BatchAnnotateImagesRequest.newBuilder()
                    .addRequests(request)
                    .build();

            BatchAnnotateImagesResponse batchResponse = vision.batchAnnotateImages(batchRequest);
            AnnotateImageResponse response = batchResponse.getResponsesList().get(0);
            SafeSearchAnnotation safeSearch = response.getSafeSearchAnnotation();

            // Check if the image contains sensitive content (based on SafeSearch values)
            return (safeSearch.getAdultValue() >= 3 ||
                    safeSearch.getViolenceValue() >= 3 ||
                    safeSearch.getRacyValue() >= 3);
        }
    }
}
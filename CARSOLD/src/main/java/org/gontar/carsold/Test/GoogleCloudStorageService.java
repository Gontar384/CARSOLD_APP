package org.gontar.carsold.Test;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Objects;

@Service
public class GoogleCloudStorageService {

    private final String bucketName = System.getenv("GOOGLE_CLOUD_BUCKET_NAME");

    // This method uploads the image to Cloud Storage after checking it with SafeSearch detection
    public String uploadFileWithSafeSearch(MultipartFile file) throws Exception {
        // Perform SafeSearch detection
        if (isImageSensitive(file)) {
            throw new Exception("Image contains sensitive content.");
        }

        // Upload the image to Google Cloud Storage
        return uploadFile(file);
    }

    // Upload the image to Google Cloud Storage
    private String uploadFile(MultipartFile file) throws IOException {
        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, Objects.requireNonNull(file.getOriginalFilename()));
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, file.getBytes());
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, file.getOriginalFilename());
    }

    // Check if the image contains sensitive content using Google Cloud Vision SafeSearch detection
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
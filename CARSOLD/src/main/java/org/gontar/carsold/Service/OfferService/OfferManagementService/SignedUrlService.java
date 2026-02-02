package org.gontar.carsold.Service.OfferService.OfferManagementService;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageException;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class SignedUrlService {

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final Storage storage;

    public SignedUrlService() {
        this.storage = StorageOptions.getDefaultInstance().getService();
    }

    public String generateSignedUrl(String objectPath) {
        if (objectPath == null || objectPath.isBlank()) {
            return null;
        }
        try {
            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, objectPath).build();
            return storage.signUrl(blobInfo, 30, TimeUnit.MINUTES,
                    Storage.SignUrlOption.withV4Signature()).toString();
        } catch (StorageException e) {
            throw new RuntimeException("Failed to generate signed URL for: " + objectPath, e);
        }
    }
}
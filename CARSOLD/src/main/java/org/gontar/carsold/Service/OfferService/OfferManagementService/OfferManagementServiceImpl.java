package org.gontar.carsold.Service.OfferService.OfferManagementService;

import com.google.cloud.storage.*;
import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.OfferWithContactDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Exception.CustomException.InappropriateContentException;
import org.gontar.carsold.Exception.CustomException.MediaNotSupportedException;
import org.gontar.carsold.Exception.CustomException.NoPermissionException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class OfferManagementServiceImpl implements OfferManagementService {

    @Value("${PERSPECTIVE_API_KEY}")
    private String perspectiveApiKey;

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final OfferRepository repository;
    private final MyUserDetailsService userDetailsService;

    public OfferManagementServiceImpl(OfferRepository repository, MyUserDetailsService userDetailsService) {
        this.repository = repository;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Offer createOffer(Offer offer, List<MultipartFile> photos) {
        Objects.requireNonNull(offer, "Offer cannot be null");
        if (isContentToxic(offer.getTitle(), offer.getDescription())) {
            throw new InappropriateContentException("Title or description are inappropriate");
        }

        User user = userDetailsService.loadUser();
        offer.setUser(user);
        Offer savedOffer = repository.save(offer);
        processImages(savedOffer, photos, user.getUsername());

        return savedOffer;
    }

    private boolean isContentToxic(String title, String description) {
        try {
            String apiUrl = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
            String fullUrl = apiUrl + "?key=" + perspectiveApiKey;
            List<String> languages = List.of("en", "pl");
            String combinedText = title + " " + description;

            List<String> textChunks = new ArrayList<>();
            int start = 0;
            while (start < combinedText.length()) {
                int end = Math.min(start + 300, combinedText.length());

                if (end < combinedText.length() && Character.isLetterOrDigit(combinedText.charAt(end))) {
                    while (end > start && Character.isLetterOrDigit(combinedText.charAt(end - 1))) {
                        end--;
                    }
                }
                textChunks.add(combinedText.substring(start, end).trim());
                start = end;
            }
            double totalScore = 0;
            int count = 0;

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            RestTemplate restTemplate = new RestTemplate();

            for (String chunk : textChunks) {
                JSONObject payload = new JSONObject();
                payload.put("comment", new JSONObject().put("text", chunk));
                payload.put("languages", languages);
                payload.put("requestedAttributes", new JSONObject().put("TOXICITY", new JSONObject()));

                HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);
                ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, request, String.class);
                JSONObject jsonResponse = new JSONObject(Objects.requireNonNull(response.getBody()));

                double toxicityScore = jsonResponse
                        .getJSONObject("attributeScores")
                        .getJSONObject("TOXICITY")
                        .getJSONObject("summaryScore")
                        .getDouble("value");

                totalScore += toxicityScore;
                count++;
            }
            double averageToxicity = totalScore / count;
            return averageToxicity > 0.3;
        } catch (Exception e) {
            log.error("Perspective API failed: {}", e.getMessage());
            return false;
        }
    }

    private void processImages(Offer offer, List<MultipartFile> photos, String username) {
        if (photos != null && !photos.isEmpty()) {
            if (photos.size() > 8) {
                log.info("Too many images uploaded. Only the first 8 will be used.");
            }
            photos = photos.subList(0, Math.min(photos.size(), 8));
            List<String> photoUrls = new ArrayList<>();

            for (int i = 0; i < photos.size(); i++) {
                MultipartFile file = photos.get(i);
                try {
                    String photoUrl = uploadToStorage(file, username, offer.getId(), i + 1);
                    photoUrls.add(photoUrl);
                } catch (MediaNotSupportedException e) {
                    log.info("Skipping unsupported image: {}", file.getOriginalFilename());
                } catch (IOException | StorageException e) {
                    log.error("Failed to upload image: {} - Reason: {}", file.getOriginalFilename(), e.getMessage());
                }
            }

            offer.setPhotos(photoUrls);
            repository.save(offer);
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

    private String uploadToStorage(MultipartFile file, String username, Long id, int imageIndex) throws StorageException, IOException {
        if (!isImageValid(file)) throw new MediaNotSupportedException("This is not an acceptable image");
        if (file.getSize() > 3 * 1024 * 1024) throw new MediaNotSupportedException("Image is too large");

        String fileName = username + "/offer" + id + "/offer" + id + "image" + imageIndex;

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();

        storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/%s/%s?timestamp=%d", bucketName, fileName, System.currentTimeMillis());
    }

    @Override
    public Offer fetchOffer(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        return repository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
    }

    @Override
    public boolean fetchPermission(Offer offer) {
        Objects.requireNonNull(offer, "Offer cannot be null");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return false;
        }
        User user = userDetailsService.loadUser();
        return offer.getUser().getId().equals(user.getId());
    }

    @Override
    public Offer updateOffer(Long id, Offer offer, List<MultipartFile> photos) {
        Objects.requireNonNull(id, "Id cannot be null");
        Objects.requireNonNull(offer, "Offer cannot be null");
        Offer existingOffer = repository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));

        if (!fetchPermission(existingOffer)) {
            throw new NoPermissionException("User has no permission to update offer");
        }
        System.out.println(existingOffer.getLastUpdated());

        if (existingOffer.getLastUpdated() != null &&
                existingOffer.getLastUpdated().isAfter(LocalDateTime.now().minusMinutes(5))) {
            throw new AccessDeniedException("User can update offer only once every 5 minutes");
        }
        if (isContentToxic(offer.getTitle(), offer.getDescription())) {
            throw new InappropriateContentException("Title or description are inappropriate");
        }

        Offer updatedOffer = updateContent(existingOffer, offer);
        processImages(updatedOffer, photos, updatedOffer.getUser().getUsername());

        return updatedOffer;
    }

    private Offer updateContent(Offer existingOffer, Offer offer) {
        existingOffer.setTitle(offer.getTitle());
        existingOffer.setBrand(offer.getBrand());
        existingOffer.setModel(offer.getModel());
        existingOffer.setBodyType(offer.getBodyType());
        existingOffer.setYear(offer.getYear());
        existingOffer.setMileage(offer.getMileage());
        existingOffer.setFuel(offer.getFuel());
        existingOffer.setCapacity(offer.getCapacity());
        existingOffer.setPower(offer.getPower());
        existingOffer.setDrive(offer.getDrive());
        existingOffer.setTransmission(offer.getTransmission());
        existingOffer.setColor(offer.getColor());
        existingOffer.setCondition(offer.getCondition());
        existingOffer.setSeats(offer.getSeats());
        existingOffer.setDoors(offer.getDoors());
        existingOffer.setSteeringWheel(offer.getSteeringWheel());
        existingOffer.setCountry(offer.getCountry());
        existingOffer.setVin(offer.getVin());
        existingOffer.setPlate(offer.getPlate());
        existingOffer.setFirstRegistration(offer.getFirstRegistration());
        existingOffer.setDescription(offer.getDescription());
        existingOffer.setPrice(offer.getPrice());
        existingOffer.setCurrency(offer.getCurrency());
        existingOffer.setLastUpdated(LocalDateTime.now());
        repository.save(existingOffer);

        return existingOffer;
    }

    @Override
    public List<PartialOfferDto> fetchAllUserOffers() {
        User user = userDetailsService.loadUser();
        List<Offer> offers = repository.findAllByUserId(user.getId());
        List<PartialOfferDto> partialOfferDtos = new ArrayList<>();
        for (Offer offer : offers) {
            PartialOfferDto partialOfferDto = new PartialOfferDto();
            partialOfferDto.setId(offer.getId());
            partialOfferDto.setTitle(offer.getTitle());
            partialOfferDto.setPhotoUrl(offer.getPhotos().getFirst());
            partialOfferDto.setPrice(offer.getPrice());
            partialOfferDto.setCurrency(offer.getCurrency());
            partialOfferDto.setPower(offer.getPower());
            partialOfferDto.setCapacity(offer.getCapacity());
            partialOfferDto.setTransmission(offer.getTransmission());
            partialOfferDto.setFuel(offer.getFuel());
            partialOfferDto.setMileage(offer.getMileage());
            partialOfferDto.setYear(offer.getYear());
            partialOfferDtos.add(partialOfferDto);
        }
        return partialOfferDtos;
    }

    @Override
    public OfferWithContactDto fetchOfferWithContact(Long id) {
        Offer offer = fetchOffer(id);
        User user = offer.getUser();
        OfferWithContactDto offerWithContactDto = new OfferWithContactDto();
        offerWithContactDto.setId(id);
        offerWithContactDto.setTitle(offer.getTitle());
        offerWithContactDto.setBrand(offer.getBrand());
        offerWithContactDto.setModel(offer.getModel());
        offerWithContactDto.setBodyType(offer.getBodyType());
        offerWithContactDto.setYear(offer.getYear());
        offerWithContactDto.setMileage(offer.getMileage());
        offerWithContactDto.setFuel(offer.getFuel());
        offerWithContactDto.setCapacity(offer.getCapacity());
        offerWithContactDto.setPower(offer.getPower());
        offerWithContactDto.setDrive(offer.getDrive());
        offerWithContactDto.setTransmission(offer.getTransmission());
        offerWithContactDto.setColor(offer.getColor());
        offerWithContactDto.setCondition(offer.getCondition());
        offerWithContactDto.setSeats(offer.getSeats());
        offerWithContactDto.setDoors(offer.getDoors());
        offerWithContactDto.setSteeringWheel(offer.getSteeringWheel());
        offerWithContactDto.setCountry(offer.getCountry());
        offerWithContactDto.setVin(offer.getVin());
        offerWithContactDto.setPlate(offer.getPlate());
        offerWithContactDto.setFirstRegistration(offer.getFirstRegistration());
        offerWithContactDto.setDescription(offer.getDescription());
        offerWithContactDto.setPrice(offer.getPrice());
        offerWithContactDto.setCurrency(offer.getCurrency());
        offerWithContactDto.setPhotos(offer.getPhotosString());
        if (user.getContactPublic()) {
            offerWithContactDto.setName(user.getName());
            offerWithContactDto.setPhone(user.getPhone());
            offerWithContactDto.setCity(user.getCity());
        }
        offerWithContactDto.setPermission(fetchPermission(offer));
        return offerWithContactDto;
    }
}

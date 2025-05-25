package org.gontar.carsold.Service.OfferService.AdminService;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageException;
import com.google.cloud.storage.StorageOptions;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Report.Report;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.gontar.carsold.Exception.CustomException.ExternalDeleteException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.ReportRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class AdminServiceImpl implements AdminService {

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final OfferRepository offerRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    public AdminServiceImpl(OfferRepository offerRepository, UserRepository userRepository, ReportRepository reportRepository) {
        this.offerRepository = offerRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
    }

    @Transactional
    @Override
    public void adminDeleteOffer(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        String username = existingOffer.getUser().getUsername();

        List<User> followers = userRepository.findByFollowedOffersContaining(existingOffer);
        followers.forEach(follower -> {
            if (follower.getFollowedOffers() != null) {
                follower.getFollowedOffers().removeIf(o -> o.getId().equals(id));
                userRepository.save(follower);
            }
        });
        try {
            String folderPrefix = username + "/offer" + id + "/";
            Storage storage = StorageOptions.getDefaultInstance().getService();
            storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                    .iterateAll()
                    .forEach(Blob::delete);
        } catch (StorageException e) {
            throw new ExternalDeleteException("Failed to delete images for offer with id = " + id + " in Google Cloud: " + e.getMessage());
        }
        offerRepository.delete(existingOffer);
    }

    @Override
    public Page<ReportDto> adminFetchReports(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size > 0 ? size : 6);
        Page<Report> reportPage = reportRepository.findAll(pageable);
        return reportPage.map(this::convertToReportDto);
    }

    private ReportDto convertToReportDto(Report report) {
        ReportDto reportDto = new ReportDto();
        reportDto.setId(report.getId());
        reportDto.setOfferId(report.getOffer().getId());
        reportDto.setReason(report.getReason());
        reportDto.setReportUsername(report.getReportUsername());
        return reportDto;
    }

    @Override
    public void adminDeleteReport(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        reportRepository.deleteById(id);
    }
}

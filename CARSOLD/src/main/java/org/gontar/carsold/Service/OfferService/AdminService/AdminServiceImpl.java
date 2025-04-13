package org.gontar.carsold.Service.OfferService.AdminService;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageException;
import com.google.cloud.storage.StorageOptions;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Report.Report;
import org.gontar.carsold.Domain.Model.ReportDto;
import org.gontar.carsold.Exception.CustomException.ExternalDeleteException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class AdminServiceImpl implements AdminService {

    @Value("${GOOGLE_CLOUD_BUCKET_NAME}")
    private String bucketName;

    private final OfferRepository offerRepository;
    private final ReportRepository reportRepository;

    public AdminServiceImpl(OfferRepository offerRepository, ReportRepository reportRepository) {
        this.offerRepository = offerRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public void adminDeleteOffer(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        String username = existingOffer.getUser().getUsername();
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
    public List<ReportDto> adminFetchReports() {
        List<Report> allReports = reportRepository.findAll();
        List<ReportDto> reportDtos = new ArrayList<>();
        for (Report report : allReports) {
            ReportDto reportDto = new ReportDto();
            reportDto.setId(report.getId());
            reportDto.setOfferId(report.getOffer().getId());
            reportDto.setReason(report.getReason());
            reportDto.setReportUsername(report.getReportUsername());
            reportDtos.add(reportDto);
        }
        return reportDtos;
    }

    @Override
    public void adminDeleteReport(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        reportRepository.deleteById(id);
    }
}

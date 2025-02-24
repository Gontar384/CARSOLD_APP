package org.gontar.carsold.Domain.Model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferDto {
    private Long id;
    private String title;
    private String brand;
    private String model;
    private String bodyType;
    private Integer year;
    private Integer mileage;
    private String fuel;
    private Integer capacity;
    private Integer power;
    private String drive;
    private String transmission;
    private String color;
    private String condition;
    private Integer seats;
    private Integer doors;
    private String steeringWheel;
    private String country;
    private String vin;
    private String plate;
    private String firstRegistration;
    private String description;
    private Integer price;
    private String currency;
    @JsonIgnore
    private List<MultipartFile> photos = new ArrayList<>();
    private List<String> photosUrls;
}
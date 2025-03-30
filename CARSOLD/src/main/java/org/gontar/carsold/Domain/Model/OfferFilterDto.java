package org.gontar.carsold.Domain.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferFilterDto {
    private String brand;
    private String model;
    private String bodyType;
    private Integer minPrice;
    private Integer maxPrice;
    private Integer minYear;
    private Integer maxYear;
    private String fuel;
    private Integer minMileage;
    private Integer maxMileage;
    private String color;
    private String transmission;
    private Integer minPower;
    private Integer maxPower;
    private Integer minCapacity;
    private Integer maxCapacity;
    private String drive;
    private String condition;
    private Integer seats;
    private Integer doors;
}

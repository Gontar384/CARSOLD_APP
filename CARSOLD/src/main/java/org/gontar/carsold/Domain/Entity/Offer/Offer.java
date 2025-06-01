package org.gontar.carsold.Domain.Entity.Offer;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gontar.carsold.Domain.Entity.User.User;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "offer")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_offer_seq")
    @SequenceGenerator(name = "my_offer_seq", sequenceName = "my_offer_sequence", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "Title cannot be empty")
    @Size(min = 5, max = 30, message = "Title must be between 5 and 30 characters")
    private String title;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "Brand cannot be empty")
    @Size(max = 30, message = "Brand must be or under 30 characters")
    private String brand;

    @Column(nullable = false, length = 30)
    @NotBlank(message = "Model cannot be empty")
    @Size(max = 30, message = "Model must be or under 30 characters")
    private String model;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "BodyType cannot be empty")
    @Size(max = 20, message = "BodyType must be or under 20 characters")
    private String bodyType;

    @Column(nullable = false)
    @NotNull(message = "Year cannot be null")
    @Min(value = 1900, message = "Year must be or above 1900")
    @Max(value = 2025, message = "Year must be or under 2025")
    private Integer year;

    @Column(nullable = false)
    @NotNull(message = "Mileage cannot be null")
    @Min(value = 0, message = "Mileage must be a positive number")
    @Max(value = 9999999, message = "Mileage must be or less than 7 digits")
    private Integer mileage;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Fuel cannot be empty")
    @Size(max = 20, message = "Fuel must be or under 20 characters")
    private String fuel;

    @Column(nullable = false)
    @NotNull(message = "Capacity cannot be null")
    @Min(value = 100, message = "Capacity must be at least 3 digits")
    @Max(value = 99999, message = "Capacity must be or less than 5 digits")
    private Integer capacity;

    @Column(nullable = false)
    @NotNull(message = "Power cannot be null")
    @Min(value = 0, message = "Power must be a positive number")
    @Max(value = 9999, message = "Power must be or less than 4 digits")
    private Integer power;

    @Column(nullable = false, length = 70)
    @NotBlank(message = "Drive cannot be empty")
    @Size(max = 70, message = "Drive must be or under 70 characters")
    private String drive;

    @Column(nullable = false, length = 10)
    @NotBlank(message = "Transmission cannot be empty")
    @Size(max = 10, message = "Transmission must be or under 10 characters")
    private String transmission;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "Color cannot be empty")
    @Size(max = 20, message = "Color must be or under 20 characters")
    private String color;

    @Column(nullable = false, length = 10)
    @NotBlank(message = "Condition cannot be empty")
    @Size(max = 10, message = "Condition must be or under 10 characters")
    private String condition;

    @Column
    @Min(value = 0, message = "Seats must be a positive number")
    @Max(value = 99, message = "Seats must be or less than 2 digits")
    private Integer seats;

    @Column
    @Min(value = 0, message = "Doors must be a positive number")
    @Max(value = 9, message = "Doors must be or less than 1 digit")
    private Integer doors;

    @Column
    @Size(max = 10, message = "SteeringWheel must be or under 10 characters")
    private String steeringWheel;

    @Column
    @Size(max = 20, message = "Country must be or under 20 characters")
    private String country;

    @Column
    @Size(min = 17, max = 17, message = "VIN must be 17 characters")
    private String vin;

    @Column
    @Size(max = 10, message = "Plate must be or under 10 characters")
    private String plate;

    @Column
    @Size(max = 10, message = "FirstRegistration must be or under 10 characters")
    private String firstRegistration;

    @Column(nullable = false, length = 2000)
    @NotBlank(message = "Description cannot be empty")
    @Size(min = 30, max = 2000, message = "Description must be between 30 and 2000 characters")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price must be a positive number")
    @Max(value = 999999999, message = "Price must be or less than 9 digits")
    private Integer price;

    @Column(nullable = false, length = 5)
    @NotBlank(message = "Currency cannot be null")
    @Size(max = 5, message = "Currency must be or under 5 characters")
    private String currency;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "offer_photos", joinColumns = @JoinColumn(name = "offer_id"))
    @Column(name = "photo_url")
    private List<String> photos = new ArrayList<>();

    @Column
    private LocalDateTime lastUpdated;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdOn;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(nullable = false)
    private Integer follows = 0;

    @Override
    public int hashCode() {
        if (getId() == null) {
            return super.hashCode();
        }
        return Objects.hash(getId());
    }
}

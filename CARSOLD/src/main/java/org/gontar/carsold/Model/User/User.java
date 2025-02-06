package org.gontar.carsold.Model.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue (strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
    private String email;

    @Column(nullable = false, unique = true, length = 15)
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 15, message = "Username must be between 3 and 15 characters")
    private String username;

    @Column(length = 60)
    private String password;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Boolean oauth2;

    @Column
    private String profilePic;

    @Column(length = 20)
    @Size(min = 3, max = 20, message = "Name must be between 3 and 20 characters")
    private String name;

    @Column(length = 20)
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;

    @Column(length = 40)
    @Size(min = 3, max = 40, message = "City must be between 3 and 40 characters")
    private String city;

    @Column(nullable = false)
    private Boolean contactPublic = false;
}

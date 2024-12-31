package org.gontar.carsold.Model;

import jakarta.persistence.*;
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

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column
    private String password;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Boolean oauth2User;

    @Column
    private String profilePic;

    @Column
    private String name;

    @Column
    private String phone;

    @Column
    private String city;

    @Column
    private Boolean contactPublic;
}

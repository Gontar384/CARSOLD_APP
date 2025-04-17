package org.gontar.carsold.Domain.Entity.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gontar.carsold.Domain.Entity.Message.Conversation;
import org.gontar.carsold.Domain.Entity.Offer.Offer;

import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "\"user\"")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_user_seq")
    @SequenceGenerator(name = "my_user_seq", sequenceName = "my_user_sequence", allocationSize = 1)
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
    @Size(max = 20, message = "Name must be under 20 characters")
    private String name;

    @Column(length = 20)
    @Size(max = 20, message = "Phone number must be under 20 characters")
    private String phone;

    @Column(length = 100)
    @Size(max = 100, message = "City must be under 100 characters")
    private String city;

    @Column(nullable = false)
    private Boolean contactPublic = false;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column
    private String followedOffers;

    public List<String> getFollowedOffers() {
        if (followedOffers == null || followedOffers.isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(followedOffers.split(",")));
    }

    public void setFollowedOffers(List<String> offers) {
        if (offers != null && !offers.isEmpty()) {
            this.followedOffers = String.join(",", offers);
        } else {
            this.followedOffers = null;
        }
    }

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Offer> offers;

    @OneToMany(mappedBy = "user1", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Conversation> conversationsAsUser1 = new ArrayList<>();

    @OneToMany(mappedBy = "user2", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Conversation> conversationsAsUser2 = new ArrayList<>();
}

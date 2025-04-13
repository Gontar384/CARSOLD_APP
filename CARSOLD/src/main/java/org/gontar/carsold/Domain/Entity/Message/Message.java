package org.gontar.carsold.Domain.Entity.Message;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gontar.carsold.Domain.Entity.User.User;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_message_seq")
    @SequenceGenerator(name = "my_message_seq", sequenceName = "my_message_sequence", allocationSize = 1)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    @JsonBackReference
    private User receiver;

    @Column(length = 1000, nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private boolean seen = false;
}

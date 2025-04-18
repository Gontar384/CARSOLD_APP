package org.gontar.carsold.Domain.Entity.Message;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gontar.carsold.Domain.Entity.User.User;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "conversation")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_conversation_seq")
    @SequenceGenerator(name = "my_conversation_seq", sequenceName = "my_conversation_sequence", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @OneToMany(mappedBy = "conversation", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    private boolean seenByUser1 = false;
    private boolean seenByUser2 = false;
    private boolean activatedByUser1 = false;
    private boolean activatedByUser2 = false;
    private boolean deletedByUser1 = false;
    private boolean deletedByUser2 = false;
}
package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Conversation;
import org.gontar.carsold.Domain.Entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository  extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    Optional<Conversation> findByUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.user1.id = :userId AND c.seenByUser1 = false AND c.activatedByUser1 = true AND c.deletedByUser1 = false AND c.blockedByUser1 = false")
    int countUnseenAndActivatedByUser1(@Param("userId") Long userId);
    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.user2.id = :userId AND c.seenByUser2 = false AND c.activatedByUser2 = true AND c.deletedByUser2 = false AND c.blockedByUser2 = false")
    int countUnseenAndActivatedByUser2(@Param("userId") Long userId);
    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user AND c.activatedByUser1 = true AND c.deletedByUser1 = false) OR (c.user2 = :user AND c.activatedByUser2 = true AND c.deletedByUser2 = false)")
    List<Conversation> findVisibleConversationsForUser(@Param("user") User user);
}

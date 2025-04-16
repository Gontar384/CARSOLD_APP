package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    int countByReceiverUsernameAndSeenFalse(String username);
    @Query(value = """
    SELECT m.* FROM message m
    JOIN (
        SELECT\s
            CASE\s
                WHEN sender_id = :userId THEN receiver_id\s
                ELSE sender_id\s
            END AS other_user_id,
            MAX(timestamp) AS max_timestamp
        FROM message
        WHERE sender_id = :userId OR receiver_id = :userId
        GROUP BY other_user_id
    ) sub ON (
        ((m.sender_id = :userId AND m.receiver_id = sub.other_user_id)
        OR (m.receiver_id = :userId AND m.sender_id = sub.other_user_id))
        AND m.timestamp = sub.max_timestamp
    )
   \s""", nativeQuery = true)
    List<Message> findLastMessagesForEachConversation(@Param("userId") Long userId);
    @Query("""
    SELECT m FROM Message m\s
    WHERE (m.sender = :user1 AND m.receiver = :user2)\s
       OR (m.sender = :user2 AND m.receiver = :user1)
    ORDER BY m.timestamp DESC
    """)
    Page<Message> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2, Pageable pageable);
}

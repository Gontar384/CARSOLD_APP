package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp DESC LIMIT 15")
    List<Message> findTop15ByConversationIdOrderByTimestampDesc(@Param("conversationId") Long conversationId);
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp DESC")
    Page<Message> findByConversationId(@Param("conversationId") Long conversationId, Pageable pageable);
}

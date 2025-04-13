package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverUsernameAndSeenFalseOrderByTimestampDesc(String username);
}

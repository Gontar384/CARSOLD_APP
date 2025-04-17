package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}

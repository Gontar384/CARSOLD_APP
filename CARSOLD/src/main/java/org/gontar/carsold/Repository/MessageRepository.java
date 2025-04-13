package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiver(User sender, User receiver);
    List<Message> findByReceiver(User receiver);
}

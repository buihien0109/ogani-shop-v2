package com.example.ogani.repository;

import com.example.ogani.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    List<User> findByEnabled(Boolean enabled);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<User> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}
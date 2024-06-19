package com.example.ogani.repository;

import com.example.ogani.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByUser_IdOrderByCreatedAtDesc(Integer id);

    long countByTags_Id(Integer id);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
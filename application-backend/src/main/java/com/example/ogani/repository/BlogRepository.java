package com.example.ogani.repository;

import com.example.ogani.entity.Blog;
import com.example.ogani.model.dto.BlogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
    Page<Blog> findAll(Specification<Blog> specification, Pageable pageable);

    List<Blog> findByUser_IdOrderByCreatedAtDesc(Integer id);

    long countByTags_Id(Integer id);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    Page<Blog> findByStatus(Boolean status, Pageable pageable);

    Optional<Blog> findByIdAndSlugAndStatus(Integer id, String slug, Boolean status);

    @Query("""
            SELECT new com.example.ogani.model.dto.BlogDto(b.id, b.title, b.slug, b.description, b.thumbnail, b.publishedAt)
            FROM Blog b
            WHERE b.status = :status
            ORDER BY b.publishedAt DESC
    """)
    Page<BlogDto> findAllBlogs(Boolean status, Pageable pageable);

    @Query("""
            SELECT new com.example.ogani.model.dto.BlogDto(b.id, b.title, b.slug, b.description, b.thumbnail, b.publishedAt)
            FROM Blog b
            LEFT JOIN b.tags t
            WHERE b.id <> :id
            AND b.status = :status
            AND t IN (SELECT t FROM Blog b JOIN b.tags t WHERE b.id = :id)
            ORDER BY b.publishedAt DESC
    """)
    Page<BlogDto> findRecommendBlogs(Integer id, Boolean status, Pageable pageable);
}
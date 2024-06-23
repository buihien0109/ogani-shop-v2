package com.example.ogani.repository;

import com.example.ogani.entity.Review;
import com.example.ogani.model.enums.ReviewStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProduct_Id(Integer productId, Sort sort);

    List<Review> findByProduct_IdAndStatus(Integer productId, ReviewStatus status);

    List<Review> findByProduct_IdAndStatus(Integer id, ReviewStatus status, Sort sort);
}
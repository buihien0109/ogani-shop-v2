package com.example.ogani.repository;

import com.example.ogani.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    Page<Favorite> findByUser_Id(Integer id, Pageable pageable);

    Optional<Favorite> findByUser_IdAndProduct_Id(Integer userId, Integer productId);

    boolean existsByUser_IdAndProduct_Id(Integer userId, Integer productId);
}
package com.example.ogani.repository;

import com.example.ogani.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    Page<Favorite> findByUser_Id(Integer id, Pageable pageable);

    List<Favorite> findByUser_Id(Integer id, Sort sort);

    Optional<Favorite> findByUser_IdAndProduct_Id(Integer userId, Integer productId);

    boolean existsByUser_IdAndProduct_Id(Integer userId, Integer productId);

    List<Favorite> findByUser_IdAndProduct_IdIn(Integer id, List<Integer> productIds);
}
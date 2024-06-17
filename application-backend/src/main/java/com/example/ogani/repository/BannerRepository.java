package com.example.ogani.repository;

import com.example.ogani.entity.Banner;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByStatus(boolean status);

    List<Banner> findByStatus(boolean status, Sort sort);
}
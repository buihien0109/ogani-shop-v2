package com.example.ogani.repository;

import com.example.ogani.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<Province, String> {
    Optional<Province> findByCode(String s);
}
package com.example.ogani.repository;

import com.example.ogani.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District, String> {
    Optional<District> findByCode(String s);

    List<District> findByProvince_Code(String provinceCode);
}
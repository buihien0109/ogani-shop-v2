package com.example.ogani.repository;

import com.example.ogani.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WardRepository extends JpaRepository<Ward, String> {
    Optional<Ward> findByCode(String s);

    List<Ward> findByDistrict_Code(String districtCode);
}
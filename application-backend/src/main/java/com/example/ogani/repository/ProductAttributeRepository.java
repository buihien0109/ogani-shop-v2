package com.example.ogani.repository;

import com.example.ogani.entity.ProductAttribute;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, Integer> {
    List<ProductAttribute> findByProduct_Id(Integer productId, Sort sort);
}
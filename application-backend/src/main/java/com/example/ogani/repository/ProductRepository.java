package com.example.ogani.repository;

import com.example.ogani.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsBySupplier_Id(Integer id);

    long countByCategory_Id(Integer id);
}
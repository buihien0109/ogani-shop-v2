package com.example.ogani.repository;

import com.example.ogani.entity.Product;
import com.example.ogani.model.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    boolean existsBySupplier_Id(Integer id);

    long countByCategory_Id(Integer id);

    Optional<Product> findByIdAndSlugAndPublished(Integer id, String slug, boolean published);

    @Query("SELECT p FROM Product p WHERE p.id != :productId AND p.category.id = :categoryId AND p.published = :published AND p.status = :status ORDER BY p.rating DESC, p.publishedAt DESC")
    List<Product> findRelatedProducts(Integer productId, Integer categoryId, boolean published, ProductStatus status);
}
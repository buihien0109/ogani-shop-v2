package com.example.ogani.repository;

import com.example.ogani.entity.Category;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentIsNull(Sort sort);
}
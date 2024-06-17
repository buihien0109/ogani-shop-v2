package com.example.ogani.repository;

import com.example.ogani.entity.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    boolean existsBySupplier_Id(Integer id);

    List<Transaction> findBySupplier_Id(Integer supplierId, Sort sort);
}
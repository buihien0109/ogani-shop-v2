package com.example.ogani.repository;

import com.example.ogani.entity.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionItemRepository extends JpaRepository<TransactionItem, Integer> {
}
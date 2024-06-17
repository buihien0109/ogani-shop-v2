package com.example.ogani.repository;

import com.example.ogani.entity.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser_Id(Integer id, Sort createdAt);
}
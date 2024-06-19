package com.example.ogani.repository;

import com.example.ogani.entity.Order;
import com.example.ogani.model.dto.RevenueDto;
import com.example.ogani.model.enums.OrderStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser_Id(Integer id, Sort createdAt);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Order> findByCreatedAtBetweenAndStatus(LocalDateTime start, LocalDateTime end, OrderStatus orderStatus);

    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    @Query(nativeQuery = true, name = "getRevenueByMonth")
    List<RevenueDto> findRevenueByMonth();
}
package com.example.ogani.service;

import com.example.ogani.entity.Order;
import com.example.ogani.entity.User;
import com.example.ogani.repository.OrderRepository;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<Order> getOrdersByUserId(Integer id) {
        return orderRepository.findByUser_Id(id, Sort.by("createdAt").descending());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by("createdAt").descending());
    }
}

package com.example.ogani.repository;

import com.example.ogani.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCart_User_IdAndProduct_Id(Integer userId, Integer productId);
}
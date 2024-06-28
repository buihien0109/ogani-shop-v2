package com.example.ogani.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartDto {
    Integer id;
    List<CartItemDto> cartItems;
    Integer totalAmount;

    public Integer getTotalAmount() {
        return cartItems.stream()
                .map(CartItemDto::getTotalAmount)
                .reduce(0, Integer::sum);
    }
}

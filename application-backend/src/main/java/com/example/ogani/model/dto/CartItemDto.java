package com.example.ogani.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemDto {
    Integer id;
    ProductDto product;
    Integer quantity;
    Integer totalAmount;

    public Integer getTotalAmount() {
        if (product.getDiscountPrice() != null) {
            return product.getDiscountPrice() * quantity;
        } else {
            return product.getPrice() * quantity;
        }
    }
}

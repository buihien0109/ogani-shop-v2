package com.example.ogani.model.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemRequest {
    Integer productId;
    Integer quantity;
    Integer price;
}

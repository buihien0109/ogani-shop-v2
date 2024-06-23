package com.example.ogani.model.dto;

import com.example.ogani.model.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDto {
    Integer id;
    String name;
    String slug;
    Integer price;
    Integer discountPrice;
    ProductStatus status;
    String thumbnail;
}

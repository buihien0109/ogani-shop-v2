package com.example.ogani.model.dto;

import com.example.ogani.model.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

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
    List<String> subImages;
    Integer stockQuantity;
    String description;

}

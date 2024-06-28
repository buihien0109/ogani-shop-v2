package com.example.ogani.model.dto;

import com.example.ogani.model.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailsDto {
    Integer id;
    String name;
    String slug;
    String description;
    Integer price;
    Integer discountPrice;
    Integer stockQuantity;
    Double rating;
    ProductStatus status;
    String thumbnail;
    List<String> subImages;
    List<ProductAttributeDto> attributes;
    CategoryDto category;
}
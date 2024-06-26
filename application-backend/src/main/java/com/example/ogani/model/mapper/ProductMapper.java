package com.example.ogani.model.mapper;

import com.example.ogani.entity.DiscountCampaign;
import com.example.ogani.entity.Product;
import com.example.ogani.model.dto.ProductAttributeDto;
import com.example.ogani.model.dto.ProductDetailsDto;
import com.example.ogani.model.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final ModelMapper modelMapper;

    public ProductDto toProductDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        productDto.setDiscountPrice(getDiscountPrice(product));
        return productDto;
    }

    public ProductDetailsDto toProductDetailsDto(Product product) {
        ProductDetailsDto productDetailsDto = modelMapper.map(product, ProductDetailsDto.class);
        productDetailsDto.setDiscountPrice(getDiscountPrice(product));
        return productDetailsDto;
    }

    private Integer getDiscountPrice(Product product) {
        Integer originalPrice = product.getPrice();
        Integer discountPrice = null;
        for (DiscountCampaign discount : product.getDiscounts()) {
            if (discount.getStatus() && discount.getStartDate().isBefore(LocalDateTime.now()) && discount.getEndDate().isAfter(LocalDateTime.now())) {
                discountPrice = switch (discount.getType()) {
                    case PERCENT -> originalPrice - (originalPrice * discount.getValue() / 100);
                    case AMOUNT -> originalPrice - discount.getValue();
                    case SAME_PRICE -> discount.getValue();
                };
            }
        }
        return discountPrice;
    }
}

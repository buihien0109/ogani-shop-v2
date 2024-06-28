package com.example.ogani.model.mapper;

import com.example.ogani.entity.CartItem;
import com.example.ogani.model.dto.CartItemDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartItemMapper {
    private final ModelMapper modelMapper;
    private final ProductMapper productMapper;

    public CartItemDto toCartItemDto(CartItem cartItem) {
        CartItemDto cartItemDto = modelMapper.map(cartItem, CartItemDto.class);
        cartItemDto.setProduct(productMapper.toProductDto(cartItem.getProduct()));
        return cartItemDto;
    }
}

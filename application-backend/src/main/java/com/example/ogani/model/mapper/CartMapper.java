package com.example.ogani.model.mapper;

import com.example.ogani.entity.Cart;
import com.example.ogani.model.dto.CartDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CartMapper {
    private final ModelMapper modelMapper;
    private final CartItemMapper cartItemMapper;

    public CartDto toCartDto(Cart cart) {
        CartDto cartDto = modelMapper.map(cart, CartDto.class);
        cartDto.setCartItems(cart.getCartItems().stream()
                .map(cartItemMapper::toCartItemDto)
                .collect(Collectors.toList()));
        return cartDto;
    }
}

package com.example.ogani.service;

import com.example.ogani.entity.CartItem;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.repository.CartItemRepository;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItem incrementQuantity(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();

        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        Integer quantity = cartItem.getQuantity() + 1;
        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new BadRequestException("Số lượng sản phẩm không đủ");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public CartItem decrementQuantity(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();

        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        int quantity = cartItem.getQuantity() - 1;
        if (quantity < 1) {
            throw new BadRequestException("Số lượng sản phẩm phải lớn hơn 0");
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();

        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        cartItemRepository.deleteById(id);
    }
}

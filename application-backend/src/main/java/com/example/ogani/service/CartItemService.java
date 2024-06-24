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

    public CartItem changeQuantityCartItemByProductId(Integer productId, Integer quantity) {
        User user = SecurityUtils.getCurrentUserLogin();

        CartItem cartItem = cartItemRepository.findByCart_User_IdAndProduct_Id(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        return changeQuantity(quantity, cartItem);
    }

    public CartItem changeQuantityCartItemById(Integer id, Integer quantity) {
        User user = SecurityUtils.getCurrentUserLogin();

        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Sản phẩm không thuộc giỏ hàng của bạn");
        }

        return changeQuantity(quantity, cartItem);
    }

    private CartItem changeQuantity(Integer quantity, CartItem cartItem) {
        Integer stockQuantity = cartItem.getProduct().getStockQuantity();
        Integer newQuantity = cartItem.getQuantity() + quantity;

        if (newQuantity < 1) {
            throw new BadRequestException("Số lượng sản phẩm phải lớn hơn 0");
        }

        if (stockQuantity < newQuantity) {
            throw new BadRequestException("Số lượng sản phẩm không đủ");
        }

        cartItem.setQuantity(newQuantity);
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

package com.example.ogani.service;

import com.example.ogani.entity.Cart;
import com.example.ogani.entity.CartItem;
import com.example.ogani.entity.Product;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.AddToCartRequest;
import com.example.ogani.repository.CartRepository;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getCart() {
        User user = SecurityUtils.getCurrentUserLogin();
        return cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng"));
    }

    public Cart addToCart(AddToCartRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id " + request.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Số lượng sản phẩm không đủ");
        }

        Cart cart = cartRepository.findByUser_Id(user.getId()).orElseGet(() -> {
            Cart newCart = Cart.builder()
                    .user(user)
                    .cartItems(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });

        cart.getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct().getId().equals(request.getProductId())).findFirst()
                .ifPresentOrElse(cartItem -> cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity()), () -> {
                    CartItem cartItem = CartItem.builder()
                            .product(product)
                            .quantity(request.getQuantity())
                            .build();
                    cart.addCartItem(cartItem);
                });

        return cartRepository.save(cart);
    }
}

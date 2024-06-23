package com.example.ogani.controller;

import com.example.ogani.model.request.AddToCartRequest;
import com.example.ogani.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/carts")
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/carts")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }
}

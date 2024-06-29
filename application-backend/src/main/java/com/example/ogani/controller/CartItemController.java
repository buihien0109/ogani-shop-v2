package com.example.ogani.controller;

import com.example.ogani.model.request.UpdateCartItemRequest;
import com.example.ogani.service.CartItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemService cartItemService;

    @PutMapping("/cart-items")
    public ResponseEntity<?> changeQuantityCartItemByProductId(@RequestParam Integer productId,
                                                               @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartItemService.changeQuantityCartItemByProductId(productId, request.getQuantity()));
    }

    @PutMapping("/cart-items/{id}")
    public ResponseEntity<?> changeQuantityCartItemById(@PathVariable Integer id,
                                                        @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartItemService.changeQuantityCartItemById(id, request.getQuantity()));
    }

    @DeleteMapping("/cart-items/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Integer id) {
        cartItemService.deleteCartItem(id);
        return ResponseEntity.ok().build();
    }
}

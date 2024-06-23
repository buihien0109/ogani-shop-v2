package com.example.ogani.controller;

import com.example.ogani.service.CartItemService;
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

    @PutMapping("/cart-items/{id}/increment")
    public ResponseEntity<?> incrementQuantity(@PathVariable Integer id) {
        return ResponseEntity.ok(cartItemService.incrementQuantity(id));
    }

    @PutMapping("/cart-items/{id}/decrement")
    public ResponseEntity<?> decrementQuantity(@PathVariable Integer id) {
        return ResponseEntity.ok(cartItemService.decrementQuantity(id));
    }

    @DeleteMapping("/cart-items/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Integer id) {
        cartItemService.deleteCartItem(id);
        return ResponseEntity.ok().build();
    }
}

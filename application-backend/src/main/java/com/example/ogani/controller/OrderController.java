package com.example.ogani.controller;

import com.example.ogani.model.request.AdminCreateOrderRequest;
import com.example.ogani.model.request.AdminUpdateOrderRequest;
import com.example.ogani.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/admin/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/admin/orders/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/admin/orders")
    public ResponseEntity<?> createOrderByAdmin(@Valid @RequestBody AdminCreateOrderRequest request) {
        return ResponseEntity.ok(orderService.createOrderByAdmin(request));
    }

    @PutMapping("/admin/orders/{id}")
    public ResponseEntity<?> updateOrderByAdmin(@Valid @RequestBody AdminUpdateOrderRequest request, @PathVariable String id) {
        return ResponseEntity.ok(orderService.updateOrderByAdmin(id, request));
    }
}

package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertCouponRequest;
import com.example.ogani.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CouponController {
    private final CouponService couponService;

    @GetMapping("/public/coupons/{code}/check")
    public ResponseEntity<?> checkCoupon(@PathVariable String code) {
        return ResponseEntity.ok(couponService.checkCouponValid(code));
    }

    @GetMapping("/admin/coupons")
    public ResponseEntity<?> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/admin/coupons/valid")
    public ResponseEntity<?> getAllValidCoupons() {
        return ResponseEntity.ok(couponService.getAllValidCoupons());
    }

    @PostMapping("/admin/coupons")
    public ResponseEntity<?> createCoupon(@Valid @RequestBody UpsertCouponRequest request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @PutMapping("/admin/coupons/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Integer id, @Valid @RequestBody UpsertCouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/admin/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }
}

package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertPaymentVoucherRequest;
import com.example.ogani.service.OrderService;
import com.example.ogani.service.PaymentVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class PaymentVoucherController {
    private final PaymentVoucherService paymentVoucherService;

    @GetMapping("/admin/payment-vouchers")
    public ResponseEntity<?> getAlPaymentVouchers() {
        return ResponseEntity.ok(paymentVoucherService.getAlPaymentVouchers());
    }

    @GetMapping("/admin/payment-vouchers/{id}")
    public ResponseEntity<?> getPaymentVoucherById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentVoucherService.getPaymentVoucherById(id));
    }

    @PostMapping
    public ResponseEntity<?> createPaymentVoucher(@RequestBody UpsertPaymentVoucherRequest request) {
        return ResponseEntity.ok(paymentVoucherService.createPaymentVoucher(request));
    }

    @PutMapping("/admin/payment-vouchers/{id}")
    public ResponseEntity<?> updatePaymentVoucher(@PathVariable Integer id, @RequestBody UpsertPaymentVoucherRequest request) {
        return ResponseEntity.ok(paymentVoucherService.updatePaymentVoucher(id, request));
    }

    @DeleteMapping("/admin/payment-vouchers/{id}")
    public ResponseEntity<?> deletePaymentVoucher(@PathVariable Integer id) {
        paymentVoucherService.deletePaymentVoucherById(id);
        return ResponseEntity.ok().build();
    }
}

package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertSupplierRequest;
import com.example.ogani.service.SupplierService;
import com.example.ogani.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    private final TransactionService transactionService;

    @GetMapping("/admin/suppliers")
    public ResponseEntity<?> getAllSuppliers() {
        return ResponseEntity.ok().body(supplierService.getAllSuppliers());
    }

    @GetMapping("/admin/suppliers/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(supplierService.getSupplierById(id));
    }

    @PostMapping("/admin/suppliers")
    public ResponseEntity<?> createSupplier(@Valid @RequestBody UpsertSupplierRequest request) {
        return ResponseEntity.ok().body(supplierService.createSupplier(request));
    }

    @PutMapping("/admin/suppliers/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable Integer id, @Valid @RequestBody UpsertSupplierRequest request) {
        return ResponseEntity.ok().body(supplierService.updateSupplier(id, request));
    }

    @DeleteMapping("/admin/suppliers/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Integer id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/suppliers/{id}/transactions")
    public ResponseEntity<?> getTransactionsBySupplier(@PathVariable Integer id) {
        return ResponseEntity.ok().body(transactionService.getTransactionsBySupplier(id));
    }
}

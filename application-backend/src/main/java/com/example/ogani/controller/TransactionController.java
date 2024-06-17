package com.example.ogani.controller;

import com.example.ogani.model.request.CreateTransactionRequest;
import com.example.ogani.model.request.UpdateTransactionRequest;
import com.example.ogani.model.request.UpsertTransactionItemRequest;
import com.example.ogani.service.TransactionItemService;
import com.example.ogani.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionItemService transactionItemService;

    @GetMapping("/admin/transactions")
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/admin/transactions/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Integer id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PostMapping("/admin/transactions")
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @PutMapping("/admin/transactions/{id}")
    public ResponseEntity<?> updateTransaction(@RequestBody UpdateTransactionRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request));
    }

    @PostMapping("/admin/transactions/{id}/items")
    public ResponseEntity<?> createTransactionItem(@RequestBody UpsertTransactionItemRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(transactionItemService.createTransactionItem(id, request));
    }

    @PutMapping("/admin/transactions/{id}/items/{itemId}")
    public ResponseEntity<?> updateTransactionItem(@RequestBody UpsertTransactionItemRequest request,
                                                   @PathVariable Integer id,
                                                   @PathVariable Integer itemId) {
        return ResponseEntity.ok(transactionItemService.updateTransactionItem(id, itemId, request));
    }

    @DeleteMapping("/admin/transactions/{id}/items/{itemId}")
    public ResponseEntity<?> deleteTransactionItem(@PathVariable Integer id, @PathVariable Integer itemId) {
        transactionItemService.deleteTransactionItem(id, itemId);
        return ResponseEntity.ok().build();
    }
}

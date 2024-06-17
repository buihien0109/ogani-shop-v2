package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertProductAttributeRequest;
import com.example.ogani.service.ProductAttributeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class ProductAttributeController {
    private final ProductAttributeService productAttributeService;

    @GetMapping("/admin/attributes")
    public ResponseEntity<?> getAttributesByProduct(@RequestParam Integer productId) {
        return ResponseEntity.ok(productAttributeService.getAttributesByProduct(productId));
    }

    @PostMapping("/admin/attributes")
    public ResponseEntity<?> createAttribute(@Valid @RequestBody UpsertProductAttributeRequest request) {
        return ResponseEntity.ok(productAttributeService.createAttribute(request));
    }

    @PutMapping("/admin/attributes/{id}")
    public ResponseEntity<?> updateAttribute(@RequestBody UpsertProductAttributeRequest request,
                                             @PathVariable Integer id) {
        return ResponseEntity.ok(productAttributeService.updateAttribute(id, request));
    }

    @DeleteMapping("/admin/attributes/{id}")
    public ResponseEntity<?> deleteAttribute(@PathVariable Integer id) {
        productAttributeService.deleteAttribute(id);
        return ResponseEntity.ok().build();
    }
}

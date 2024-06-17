package com.example.ogani.controller;

import com.example.ogani.model.request.UpdateProductImageRequest;
import com.example.ogani.model.request.UpdateProductQuantityRequest;
import com.example.ogani.model.request.UpsertProductRequest;
import com.example.ogani.service.ProductService;
import com.example.ogani.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ReviewService reviewService;

    @GetMapping("/admin/products")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/admin/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/admin/products")
    public ResponseEntity<?> createProduct(@Valid @RequestBody UpsertProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> updateProduct(@Valid @RequestBody UpsertProductRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PutMapping("/admin/products/update-quantity")
    public ResponseEntity<?> updateProductQuantity(@Valid @RequestBody List<UpdateProductQuantityRequest> request) {
        productService.updateProductQuantity(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/products/{id}/reviews")
    public ResponseEntity<?> getReviewsByProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(id));
    }

    @PostMapping("/admin/products/{id}/images/update")
    public ResponseEntity<?> updateImage(@PathVariable Integer id, @Valid @RequestBody UpdateProductImageRequest request) {
        productService.updateImage(id, request);
        return ResponseEntity.ok().build();
    }
}

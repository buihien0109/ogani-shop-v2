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

    @GetMapping("/public/products/all")
    public ResponseEntity<?> getAllProducts(@RequestParam(required = false, defaultValue = "8") Integer limit) {
        return ResponseEntity.ok(productService.getAllProductsByCategories(limit));
    }

    @GetMapping("/public/products/discount")
    public ResponseEntity<?> getAllProductsDiscount(@RequestParam(required = false, defaultValue = "1") Integer page,
                                                    @RequestParam(required = false, defaultValue = "8") Integer limit) {
        return ResponseEntity.ok(productService.getAllDiscountedProducts(page, limit));
    }

    @GetMapping("/public/products")
    public ResponseEntity<?> getAllProductsByCategory(@RequestParam String parentSlug,
                                                      @RequestParam(required = false) String subSlug,
                                                      @RequestParam(required = false, defaultValue = "1") Integer page,
                                                      @RequestParam(required = false, defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(productService.getAllProductsByCategory(page, limit, parentSlug, subSlug));
    }

    @GetMapping("/public/products/{id}/{slug}")
    public ResponseEntity<?> getProductDetails(@PathVariable Integer id, @PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductDetails(id, slug));
    }

    @GetMapping("/public/products/{id}/related-products")
    public ResponseEntity<?> getRelatedProducts(@PathVariable Integer id,
                                                @RequestParam(required = false, defaultValue = "4") Integer limit) {
        return ResponseEntity.ok(productService.getRelatedProducts(id, limit));
    }

    // available reviews
    @GetMapping("/public/products/{id}/reviews")
    public ResponseEntity<?> getAvailableReviewsByProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.getAvailableReviewsByProduct(id));
    }

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

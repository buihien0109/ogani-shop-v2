package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertParentCategory;
import com.example.ogani.model.request.UpsertSubCategory;
import com.example.ogani.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping(value = {"/public/categories", "/admin/categories"})
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/admin/categories/create-parent-category")
    public ResponseEntity<?> createParentCategory(@Valid @RequestBody UpsertParentCategory request) {
        return ResponseEntity.ok(categoryService.createParentCategory(request));
    }

    @PostMapping("/admin/categories/create-sub-category")
    public ResponseEntity<?> createSubCategory(@Valid @RequestBody UpsertSubCategory request) {
        return ResponseEntity.ok(categoryService.createSubCategory(request));
    }

    @PutMapping("/admin/categories/{id}/update-parent-category")
    public ResponseEntity<?> updateParentCategory(@Valid @RequestBody UpsertParentCategory request, @PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.updateParentCategory(id, request));
    }

    @PutMapping("/admin/categories/{id}/update-sub-category")
    public ResponseEntity<?> updateSubCategory(@Valid @RequestBody UpsertSubCategory request, @PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.updateSubCategory(id, request));
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}

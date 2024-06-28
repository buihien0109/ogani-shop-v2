package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertTagRequest;
import com.example.ogani.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @GetMapping("/public/tags")
    public ResponseEntity<?> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/public/tags/{slug}")
    public ResponseEntity<?> getTagBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(tagService.getTagBySlug(slug));
    }

    @GetMapping("/admin/tags")
    public ResponseEntity<?> getAllTagsByAdmin() {
        return ResponseEntity.ok(tagService.getAllTagsByAdmin());
    }

    @GetMapping("/admin/tags/{id}")
    public ResponseEntity<?> getTagById(@PathVariable Integer id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }

    @PostMapping("/admin/tags")
    public ResponseEntity<?> createTag(@Valid @RequestBody UpsertTagRequest request) {
        return new ResponseEntity<>(tagService.saveTag(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/tags/{id}")
    public ResponseEntity<?> updateTag(@PathVariable Integer id,
                                       @Valid @RequestBody UpsertTagRequest request) {
        return ResponseEntity.ok(tagService.updateTag(id, request));
    }

    @DeleteMapping("/admin/tags/{id}")
    public ResponseEntity<?> deleteTag(@PathVariable Integer id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/tags/{id}/blogs")
    public ResponseEntity<?> getAllBlogsByTagId(@PathVariable Integer id) {
        return ResponseEntity.ok(tagService.getAllBlogsByTagId(id));
    }
}

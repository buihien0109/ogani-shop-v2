package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertBlogRequest;
import com.example.ogani.service.BlogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class BlogControlller {
    private final BlogService blogService;

    @GetMapping("/public/blogs")
    public ResponseEntity<?> getAllBlogs(@RequestParam(defaultValue = "1") Integer page,
                                         @RequestParam(defaultValue = "10") Integer limit,
                                         @RequestParam(required = false) String search,
                                         @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(blogService.getAllBlogs(page, limit, search, tag));
    }

    @GetMapping("/public/blogs/latest-blogs")
    public ResponseEntity<?> getLatestBlogs(@RequestParam(defaultValue = "5") Integer limit) {
        return ResponseEntity.ok(blogService.getLatestBlogs(limit));
    }

    @GetMapping("/public/blogs/{id}/{slug}")
    public ResponseEntity<?> getBlogDetails(@PathVariable Integer id,
                                            @PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogDetails(id, slug));
    }

    @GetMapping("/public/blogs/{id}/recommend-blogs")
    public ResponseEntity<?> getRecommendBlogs(@PathVariable Integer id,
                                               @RequestParam(defaultValue = "5") Integer limit) {
        return ResponseEntity.ok(blogService.getRecommendBlogs(id, limit));
    }

    @GetMapping("/admin/blogs")
    public ResponseEntity<?> getAllBlogsByAdmin() {
        return ResponseEntity.ok(blogService.getAllBlogsByAdmin());
    }

    @GetMapping("/admin/blogs/own-blogs")
    public ResponseEntity<?> getOwnBlogs() {
        return ResponseEntity.ok(blogService.getAllOwnBlogs());
    }

    @PostMapping("/admin/blogs")
    public ResponseEntity<?> createBlog(@RequestBody UpsertBlogRequest request) {
        return new ResponseEntity<>(blogService.createBlog(request), HttpStatus.CREATED);
    }

    @GetMapping("/admin/blogs/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Integer id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PutMapping("/admin/blogs/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable Integer id, @RequestBody UpsertBlogRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    @DeleteMapping("/admin/blogs/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Integer id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}

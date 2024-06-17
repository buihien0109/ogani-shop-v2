package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertReviewRequestAdmin;
import com.example.ogani.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PutMapping("/admin/reviews/{id}")
    public ResponseEntity<?> adminUpdateReview(@Valid @RequestBody UpsertReviewRequestAdmin request, @PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.updateReviewByAdmin(request, id));
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<?> adminDeleteReview(@PathVariable Integer id) {
        reviewService.deleteReviewByAdmin(id);
        return ResponseEntity.ok().build();
    }
}

package com.example.ogani.controller;

import com.example.ogani.model.request.CreateReviewAnonymousRequest;
import com.example.ogani.model.request.UpsertReviewRequest;
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

    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@Valid @RequestBody UpsertReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @PostMapping("/public/reviews")
    public ResponseEntity<?> createReviewAnonymous(@Valid @RequestBody CreateReviewAnonymousRequest request) {
        return ResponseEntity.ok(reviewService.createReviewAnonymous(request));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<?> updateReview(@Valid @RequestBody UpsertReviewRequest request, @PathVariable Integer id) {
        return ResponseEntity.ok(reviewService.updateReview(request, id));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

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

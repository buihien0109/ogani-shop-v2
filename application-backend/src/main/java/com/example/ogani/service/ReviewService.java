package com.example.ogani.service;

import com.example.ogani.entity.Review;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertReviewRequestAdmin;
import com.example.ogani.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public List<Review> getReviewsByProduct(Integer productId) {
        return reviewRepository.findByProduct_Id(productId, Sort.by("createdAt").descending());
    }

    public Review updateReviewByAdmin(UpsertReviewRequestAdmin request, Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(request.getStatus());
        return reviewRepository.save(review);
    }

    public void deleteReviewByAdmin(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));
        reviewRepository.delete(review);
    }
}

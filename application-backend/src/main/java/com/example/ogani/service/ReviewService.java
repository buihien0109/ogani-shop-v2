package com.example.ogani.service;

import com.example.ogani.entity.Product;
import com.example.ogani.entity.Review;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.ReviewDto;
import com.example.ogani.model.enums.ReviewStatus;
import com.example.ogani.model.mapper.ReviewMapper;
import com.example.ogani.model.request.CreateReviewAnonymousRequest;
import com.example.ogani.model.request.UpsertReviewRequest;
import com.example.ogani.model.request.UpsertReviewRequestAdmin;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.repository.ReviewRepository;
import com.example.ogani.security.SecurityUtils;
import com.example.ogani.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    public List<ReviewDto> getAvailableReviewsByProduct(Integer id) {
        List<Review> reviews = reviewRepository.findByProduct_IdAndStatus(id, ReviewStatus.ACCEPTED,
                Sort.by("createdAt").descending());
        return reviews.stream()
                .map(reviewMapper::toReviewDto)
                .toList();
    }

    public List<Review> getReviewsByProduct(Integer productId) {
        return reviewRepository.findByProduct_Id(productId, Sort.by("createdAt").descending());
    }

    @Transactional
    public Review createReview(UpsertReviewRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + request.getProductId()));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .status(ReviewStatus.ACCEPTED)
                .build();
        reviewRepository.save(review);

        updateRatingOfProduct(product);
        return review;
    }

    public Review createReviewAnonymous(CreateReviewAnonymousRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + request.getProductId()));

        Review review = Review.builder()
                .authorName(request.getAuthorName())
                .authorEmail(request.getAuthorEmail())
                .authorPhone(request.getAuthorPhone())
                .authorAvatar(StringUtils.generateLinkImage(request.getAuthorName()))
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .status(ReviewStatus.PENDING)
                .build();

        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(UpsertReviewRequest request, Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + request.getProductId()));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Không thể cập nhật đánh giá của người khác!");
        }

        if (!review.getProduct().getId().equals(product.getId())) {
            throw new BadRequestException("Đánh giá không thuộc sản phẩm này!");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        reviewRepository.save(review);

        updateRatingOfProduct(product);
        return review;
    }

    @Transactional
    public void deleteReview(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Không thể xóa đánh giá của người khác!");
        }

        updateRatingOfProduct(review.getProduct());
        reviewRepository.delete(review);
    }

    @Transactional
    public Review updateReviewByAdmin(UpsertReviewRequestAdmin request, Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(request.getStatus());
        reviewRepository.save(review);

        updateRatingOfProduct(review.getProduct());
        return review;
    }

    @Transactional
    public void deleteReviewByAdmin(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy review có id = " + id));
        reviewRepository.delete(review);
        updateRatingOfProduct(review.getProduct());
    }

    private void updateRatingOfProduct(Product product) {
        List<Review> reviews = reviewRepository.findByProduct_IdAndStatus(product.getId(), ReviewStatus.ACCEPTED);
        double rating = reviews.stream().mapToDouble(Review::getRating).average().orElse(0);
        rating = Math.round(rating * 10) / 10.0;
        product.setRating(rating);
        productRepository.save(product);
    }
}

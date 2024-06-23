package com.example.ogani.service;

import com.example.ogani.entity.Favorite;
import com.example.ogani.entity.Product;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.AddFavoriteRequest;
import com.example.ogani.repository.FavoriteRepository;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public Page<Favorite> getFavoritesByCurrentUser(Integer page, Integer limit) {
        User user = SecurityUtils.getCurrentUserLogin();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        return favoriteRepository.findByUser_Id(user.getId(), pageable);
    }

    public Favorite addToFavorite(AddFavoriteRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id " + request.getProductId()));

        if (favoriteRepository.findByUser_IdAndProduct_Id(user.getId(), request.getProductId()).isPresent()) {
            throw new BadRequestException("Sản phẩm đã có trong danh sách yêu thích");
        }

        Favorite favorite = Favorite.builder()
                .product(product)
                .user(user)
                .build();

        return favoriteRepository.save(favorite);
    }

    public void deleteFromFavorite(Integer productId) {
        User user = SecurityUtils.getCurrentUserLogin();

        Favorite favorite = favoriteRepository.findByUser_IdAndProduct_Id(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại trong danh sách yêu thích"));

        favoriteRepository.delete(favorite);
    }

    public boolean checkProductExistsInFavorite(Integer productId) {
        User user = SecurityUtils.getCurrentUserLogin();
        if (user == null) {
            log.warn("User is not authenticated");
            return false;
        }
        return favoriteRepository.existsByUser_IdAndProduct_Id(user.getId(), productId);
    }
}

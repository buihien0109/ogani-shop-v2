package com.example.ogani.service;

import com.example.ogani.entity.Favorite;
import com.example.ogani.entity.Product;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.FavoriteDto;
import com.example.ogani.model.mapper.FavoriteMapper;
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

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final FavoriteMapper favoriteMapper;

    public Page<FavoriteDto> getFavoritesByCurrentUser(Integer page, Integer limit) {
        User user = SecurityUtils.getCurrentUserLogin();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Favorite> pageData = favoriteRepository.findByUser_Id(user.getId(), pageable);
        return pageData.map(favoriteMapper::toFavoriteDto);
    }

    public List<FavoriteDto> getFavorites() {
        User user = SecurityUtils.getCurrentUserLogin();
        List<Favorite> favorites = favoriteRepository.findByUser_Id(user.getId(), Sort.by("createdAt").descending());
        return favorites.stream()
                .map(favoriteMapper::toFavoriteDto)
                .toList();
    }

    public FavoriteDto addToFavorite(AddFavoriteRequest request) {
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

        favoriteRepository.save(favorite);
        return favoriteMapper.toFavoriteDto(favorite);
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

package com.example.ogani.model.mapper;

import com.example.ogani.entity.Favorite;
import com.example.ogani.model.dto.FavoriteDto;
import com.example.ogani.model.dto.ProductDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FavoriteMapper {
    private final ModelMapper modelMapper;
    private final ProductMapper productMapper;

    public FavoriteDto toFavoriteDto(Favorite favorite) {
        FavoriteDto favoriteDto = modelMapper.map(favorite, FavoriteDto.class);
        ProductDto productDto = productMapper.toProductDto(favorite.getProduct());
        favoriteDto.setProduct(productDto);
        return favoriteDto;
    }
}

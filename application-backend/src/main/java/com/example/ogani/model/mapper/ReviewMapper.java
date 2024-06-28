package com.example.ogani.model.mapper;

import com.example.ogani.entity.Review;
import com.example.ogani.model.dto.ReviewDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewMapper {
    private final ModelMapper modelMapper;

    public ReviewDto toReviewDto(Review review) {
        return modelMapper.map(review, ReviewDto.class);
    }
}

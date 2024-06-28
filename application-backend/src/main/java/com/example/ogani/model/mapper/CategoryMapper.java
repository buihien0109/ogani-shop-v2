package com.example.ogani.model.mapper;

import com.example.ogani.entity.Category;
import com.example.ogani.model.dto.CategoryDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
    private final ModelMapper modelMapper;

    public CategoryDto toCategoryDto(Category category) {
        return modelMapper.map(category, CategoryDto.class);
    }
}

package com.example.ogani.model.mapper;

import com.example.ogani.entity.Blog;
import com.example.ogani.model.dto.BlogDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BlogMapper {
    private final ModelMapper modelMapper;

    public BlogDto toBlogDto(Blog blog) {
        return modelMapper.map(blog, BlogDto.class);
    }
}

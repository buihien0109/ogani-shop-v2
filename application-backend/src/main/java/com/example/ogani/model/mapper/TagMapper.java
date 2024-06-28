package com.example.ogani.model.mapper;

import com.example.ogani.entity.Tag;
import com.example.ogani.model.dto.TagDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TagMapper {
    private final ModelMapper modelMapper;

    public TagDto toTagDto(Tag tag) {
        return modelMapper.map(tag, TagDto.class);
    }
}

package com.example.ogani.model.mapper;

import com.example.ogani.entity.Banner;
import com.example.ogani.model.dto.BannerDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BannerMapper {
    private final ModelMapper modelMapper;

    public BannerDto toBannerDto(Banner banner) {
        return modelMapper.map(banner, BannerDto.class);
    }
}

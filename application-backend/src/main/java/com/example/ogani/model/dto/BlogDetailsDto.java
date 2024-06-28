package com.example.ogani.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogDetailsDto {
    Integer id;
    String title;
    String slug;
    String description;
    String content;
    String thumbnail;
    LocalDateTime publishedAt;
    UserDto user;
    List<TagDto> tags;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    static class UserDto {
        Integer id;
        String name;
        String avatar;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    static class TagDto {
        Integer id;
        String name;
        String slug;
    }
}

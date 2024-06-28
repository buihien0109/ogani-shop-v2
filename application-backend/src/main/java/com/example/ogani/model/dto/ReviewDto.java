package com.example.ogani.model.dto;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewDto {
    Integer id;
    String authorName;
    String authorAvatar;
    String authorEmail;
    Integer rating;
    String comment;
    LocalDateTime createdAt;
    UserDto user;

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
}

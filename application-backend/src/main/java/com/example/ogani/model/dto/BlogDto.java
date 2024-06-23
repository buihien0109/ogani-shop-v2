package com.example.ogani.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogDto {
    Integer id;
    String title;
    String slug;
    String description;
    String thumbnail;
    LocalDateTime publishedAt;
}

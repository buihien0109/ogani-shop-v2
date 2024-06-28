package com.example.ogani.model.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerDto {
    Integer id;
    String name;
    String slug;
    String linkRedirect;
    String thumbnail;
}

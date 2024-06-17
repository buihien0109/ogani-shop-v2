package com.example.ogani.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SortBannerRequest {
    @NotNull(message = "Danh sách banner không được để trống")
    List<Integer> bannerIds;
}

package com.example.ogani.model.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertReviewRequest {
    @NotNull(message = "Sản phẩm không được để trống")
    Integer productId;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Đánh giá phải từ 1 đến 5")
    Integer rating;

    @NotEmpty(message = "Bình luận không được để trống")
    @NotNull(message = "Bình luận không được để trống")
    String comment;
}

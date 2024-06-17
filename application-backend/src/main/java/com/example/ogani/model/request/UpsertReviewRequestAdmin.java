package com.example.ogani.model.request;

import com.example.ogani.model.enums.ReviewStatus;
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
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertReviewRequestAdmin {
    @NotNull(message = "Sản phẩm không được để trống")
    Integer productId;

    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Rating phải từ 1 đến 5")
    Integer rating;

    @NotEmpty(message = "Nội dung không được để trống")
    @NotNull(message = "Nội dung không được để trống")
    String comment;

    @NotNull(message = "Trạng thái không được để trống")
    ReviewStatus status;
}

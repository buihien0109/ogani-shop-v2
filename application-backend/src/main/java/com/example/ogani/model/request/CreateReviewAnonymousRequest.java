package com.example.ogani.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateReviewAnonymousRequest {
    @NotEmpty(message = "Họ tên không được để trống")
    @JsonProperty("name")
    String authorName;

    @NotEmpty(message = "Email không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message = "Email không hợp lệ")
    @JsonProperty("email")
    String authorEmail;

    @NotEmpty(message = "Số điện thoại tác giả không được để trống")
    @Pattern(regexp = "0\\d{9,10}", message = "Số điện thoại không hợp lệ")
    @JsonProperty("phone")
    String authorPhone;

    @NotNull(message = "Đánh giá không được để trống")
    @Min(value = 1, message = "Đánh giá phải từ 1 đến 5")
    @Max(value = 5, message = "Đánh giá phải từ 1 đến 5")
    Integer rating;

    @NotEmpty(message = "Bình luận không được để trống")
    @NotNull(message = "Bình luận không được để trống")
    String comment;

    @NotNull(message = "Sản phẩm không được để trống")
    Integer productId;
}

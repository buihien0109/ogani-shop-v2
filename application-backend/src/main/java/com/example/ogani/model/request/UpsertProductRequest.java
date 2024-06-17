package com.example.ogani.model.request;

import com.example.ogani.model.enums.ProductStatus;
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
public class UpsertProductRequest {
    @NotEmpty(message = "Tên sản phẩm không được để trống")
    String name;

    @NotEmpty(message = "Mô tả không được để trống")
    String description;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    Integer stockQuantity;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    Integer price;

    @NotNull(message = "Trạng thái kinh doanh không được để trống")
    ProductStatus status;

    @NotNull(message = "Trạng thái không được để trống")
    Boolean published;

    @NotNull(message = "Danh mục không được để trống")
    Integer categoryId;

    @NotNull(message = "Nhà cung cấp không được để trống")
    Integer supplierId;
}

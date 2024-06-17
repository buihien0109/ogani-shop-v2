package com.example.ogani.model.request;

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
public class UpsertProductAttributeRequest {
    @NotEmpty(message = "Tên thuộc tính không được để trống")
    String name;

    @NotEmpty(message = "Giá trị không được để trống")
    String value;

    @NotNull(message = "Sản phẩm không được để trống")
    Integer productId;
}

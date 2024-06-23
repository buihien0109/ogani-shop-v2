package com.example.ogani.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddFavoriteRequest {
    @NotNull(message = "Sản phẩm không được để trống")
    Integer productId;
}

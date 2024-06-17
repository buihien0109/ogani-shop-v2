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
public class UpsertTransactionItemRequest {
    @NotNull(message = "Mã sản phẩm không được để trống")
    Integer productId;

    @NotNull(message = "Số lượng không được để trống")
    Integer quantity;

    @NotNull(message = "Giá mua không được để trống")
    Integer purchasePrice;
}

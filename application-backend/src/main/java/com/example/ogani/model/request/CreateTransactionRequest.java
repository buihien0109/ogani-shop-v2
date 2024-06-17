package com.example.ogani.model.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateTransactionRequest {
    @NotEmpty(message = "Tên người gửi không được để trống")
    String senderName;

    @NotEmpty(message = "Tên người nhận không được để trống")
    String receiverName;

    @NotNull(message = "Nhà cung cấp không được để trống")
    Integer supplierId;

    @NotNull(message = "Ngày giao dịch không được để trống")
    LocalDateTime transactionDate;

    @NotNull(message = "Danh sách sản phẩm không được để trống")
    List<TransactionItemRequest> transactionItems;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TransactionItemRequest {
        @NotNull(message = "Mã sản phẩm không được để trống")
        Integer productId;

        @NotNull(message = "Số lượng không được để trống")
        Integer quantity;

        @NotNull(message = "Giá mua không được để trống")
        Integer purchasePrice;
    }
}

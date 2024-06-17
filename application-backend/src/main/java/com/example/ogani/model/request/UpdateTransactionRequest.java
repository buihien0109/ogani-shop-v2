package com.example.ogani.model.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateTransactionRequest {
    @NotEmpty(message = "Tên người gửi không được để trống")
    String senderName;

    @NotEmpty(message = "Tên người nhận không được để trống")
    String receiverName;

    @NotNull(message = "Nhà cung cấp không được để trống")
    Integer supplierId;

    @NotNull(message = "Ngày giao dịch không được để trống")
    LocalDateTime transactionDate;
}

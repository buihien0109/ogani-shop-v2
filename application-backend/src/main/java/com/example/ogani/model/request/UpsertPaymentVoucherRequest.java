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
public class UpsertPaymentVoucherRequest {
    @NotEmpty(message = "Mục đích chi không được để trống")
    String purpose;

    @NotEmpty(message = "Ghi chú không được để trống")
    String note;

    @NotNull(message = "Số tiền không được để trống")
    Integer amount;

    @NotNull(message = "Người chi không được để trống")
    Integer userId;
}

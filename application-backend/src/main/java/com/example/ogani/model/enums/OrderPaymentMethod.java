package com.example.ogani.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum OrderPaymentMethod {
    COD("Thanh toán khi nhận hàng"),
    MOMO("Momo"),
    ZALO_PAY("ZaloPay"),
    VN_PAY("VNPay"),
    BANK_TRANSFER("Chuyển khoản ngân hàng");

    private final String value;
}

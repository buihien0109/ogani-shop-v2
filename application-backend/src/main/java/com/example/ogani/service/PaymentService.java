package com.example.ogani.service;

import com.example.ogani.entity.Order;
import com.example.ogani.model.enums.OrderPaymentMethod;
import com.example.ogani.model.response.PaymentResponse;
import com.example.ogani.payment.PaymentStrategy;
import com.example.ogani.payment.impl.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final BankTransferPayment bankTransferPayment;
    private final ZaloPayPayment zaloPayPayment;
    private final VnPayPayment vnPayPayment;
    private final MomoPayment momoPayment;
    private final CODPayment codPayment;

    public PaymentStrategy getPaymentStrategy(OrderPaymentMethod method) {
        return switch (method) {
            case BANK_TRANSFER -> bankTransferPayment;
            case COD -> codPayment;
            case ZALO_PAY -> zaloPayPayment;
            case VN_PAY -> vnPayPayment;
            case MOMO -> momoPayment;
        };
    }

    public PaymentResponse pay(Order order) {
        PaymentStrategy paymentStrategy = getPaymentStrategy(order.getPaymentMethod());
        return paymentStrategy.pay(order);
    }
}

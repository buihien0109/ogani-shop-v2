package com.example.ogani.payment;

import com.example.ogani.entity.Order;
import com.example.ogani.model.response.PaymentResponse;

public interface PaymentStrategy {
    PaymentResponse pay(Order order);
}

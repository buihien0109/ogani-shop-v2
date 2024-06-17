package com.example.ogani.repository;

import com.example.ogani.entity.PaymentVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentVoucherRepository extends JpaRepository<PaymentVoucher, Integer> {
}
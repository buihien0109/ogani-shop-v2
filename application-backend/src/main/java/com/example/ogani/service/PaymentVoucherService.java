package com.example.ogani.service;

import com.example.ogani.entity.PaymentVoucher;
import com.example.ogani.entity.User;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertPaymentVoucherRequest;
import com.example.ogani.repository.PaymentVoucherRepository;
import com.example.ogani.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentVoucherService {
    private final PaymentVoucherRepository paymentVoucherRepository;
    private final UserRepository userRepository;

    public List<PaymentVoucher> getAlPaymentVouchers() {
        return paymentVoucherRepository.findAll(Sort.by("createdAt").descending());
    }

    public PaymentVoucher getPaymentVoucherById(Integer id) {
        return paymentVoucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu chi với id: " + id));
    }

    public PaymentVoucher createPaymentVoucher(UpsertPaymentVoucherRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + request.getUserId()));

        PaymentVoucher paymentVoucher = PaymentVoucher.builder()
                .purpose(request.getPurpose())
                .note(request.getNote())
                .amount(request.getAmount())
                .user(user)
                .build();

        return paymentVoucherRepository.save(paymentVoucher);
    }

    public PaymentVoucher updatePaymentVoucher(Integer id, UpsertPaymentVoucherRequest request) {
        PaymentVoucher paymentVoucher = paymentVoucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu chi với id: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + request.getUserId()));

        paymentVoucher.setPurpose(request.getPurpose());
        paymentVoucher.setNote(request.getNote());
        paymentVoucher.setAmount(request.getAmount());
        paymentVoucher.setUser(user);

        return paymentVoucherRepository.save(paymentVoucher);
    }

    public void deletePaymentVoucherById(Integer id) {
        PaymentVoucher paymentVoucher = paymentVoucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu chi với id: " + id));
        paymentVoucherRepository.delete(paymentVoucher);
    }
}

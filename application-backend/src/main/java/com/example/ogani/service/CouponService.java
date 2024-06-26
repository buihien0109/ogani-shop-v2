package com.example.ogani.service;

import com.example.ogani.entity.Coupon;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertCouponRequest;
import com.example.ogani.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;

    public Coupon checkCouponValid(String couponCode) {
        Coupon coupon = couponRepository.findByCodeAndStatus(couponCode, true)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không hợp lệ"));

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getEndDate())) {
            throw new BadRequestException("Coupon đã hết hạn");
        }

        if (coupon.getUsed() >= coupon.getQuantity()) {
            throw new BadRequestException("Coupon đã hết lượt sử dụng");
        }

        return coupon;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll(Sort.by("createdAt").descending());
    }

    public  List<Coupon> getAllValidCoupons() {
        List<Coupon> coupons = couponRepository
                .findByStartDateBeforeAndEndDateAfterAndStatus(LocalDateTime.now(), LocalDateTime.now(), true);
        return coupons.stream()
                .filter(coupon -> coupon.getUsed() < coupon.getQuantity())
                .toList();
    }

    public Coupon createCoupon(UpsertCouponRequest request) {
        if (couponRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã coupon không được trùng nhau");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .discount(request.getDiscount())
                .quantity(request.getQuantity())
                .used(0)
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Integer id, UpsertCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không tồn tại"));

        if (couponRepository.existsByCode(request.getCode()) && !coupon.getCode().equals(request.getCode())) {
            throw new BadRequestException("Mã coupon không được trùng nhau");
        }

        if (coupon.getUsed() > request.getQuantity()) {
            throw new BadRequestException("Số lượt sử dụng đã vượt quá số lượng coupon");
        }

        coupon.setCode(request.getCode());
        coupon.setDiscount(request.getDiscount());
        coupon.setQuantity(request.getQuantity());
        coupon.setStatus(request.getStatus());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());

        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Integer id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon không tồn tại"));

        if (coupon.getUsed() > 0) {
            throw new BadRequestException("Coupon đã được sử dụng không thể xóa");
        }

        couponRepository.delete(coupon);
    }
}

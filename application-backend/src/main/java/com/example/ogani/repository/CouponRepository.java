package com.example.ogani.repository;

import com.example.ogani.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    Optional<Coupon> findByCodeAndStatus(String code, boolean status);

    boolean existsByCode(String code);

    List<Coupon> findByStartDateBeforeAndEndDateAfterAndStatus(LocalDateTime start, LocalDateTime end, boolean status);

    Optional<Coupon> findByCode(String couponCode);
}
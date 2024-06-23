package com.example.ogani.repository;

import com.example.ogani.entity.PaymentVoucher;
import com.example.ogani.model.dto.ExpenseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PaymentVoucherRepository extends JpaRepository<PaymentVoucher, Integer> {
    List<PaymentVoucher> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    @Query("""
            SELECT new com.example.ogani.model.dto.ExpenseDto(
                MONTH(pv.createdAt),
                YEAR(pv.createdAt),
                SUM(pv.amount)
            )
            FROM PaymentVoucher pv
            GROUP BY MONTH(pv.createdAt), YEAR(pv.createdAt)
            ORDER BY YEAR(pv.createdAt), MONTH(pv.createdAt)
            """)
    List<ExpenseDto> findExpenseByMonth();
}
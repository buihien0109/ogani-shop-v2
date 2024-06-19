package com.example.ogani.entity;

import com.example.ogani.model.dto.RevenueDto;
import com.example.ogani.model.enums.OrderPaymentMethod;
import com.example.ogani.model.enums.OrderShippingMethod;
import com.example.ogani.model.enums.OrderStatus;
import com.example.ogani.model.enums.OrderUserType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@SqlResultSetMappings(
        value = {
                @SqlResultSetMapping(
                        name = "RevenueResultMapping",
                        classes = @ConstructorResult(
                                targetClass = RevenueDto.class,
                                columns = {
                                        @ColumnResult(name = "month", type = Integer.class),
                                        @ColumnResult(name = "year", type = Integer.class),
                                        @ColumnResult(name = "revenue", type = Long.class)
                                }
                        )
                ),

        }

)

@NamedNativeQuery(
        name = "getRevenueByMonth",
        resultSetMapping = "RevenueResultMapping",
        query = """
                    SELECT
                        MONTH(sub.created_at) AS month,
                        YEAR(sub.created_at) AS year,
                        SUM(sub.total) AS revenue
                    FROM (
                        SELECT
                            o.created_at,
                            CASE
                                WHEN o.coupon_code IS NOT NULL and o.coupon_discount  > 0 THEN SUM(oi.quantity * oi.price * (1 - o.coupon_discount / 100))
                                ELSE SUM(oi.quantity * oi.price)
                            END AS total
                        FROM
                            orders o
                        JOIN
                            order_items oi ON o.id = oi.order_id
                        WHERE
                            o.status = 'COMPLETE'
                        GROUP BY
                            o.id, o.created_at, o.coupon_code, o.coupon_discount
                        ) AS sub
                    GROUP BY
                        MONTH(sub.created_at), YEAR(sub.created_at)
                    ORDER BY
                        YEAR(sub.created_at), MONTH(sub.created_at)
                """
)

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Order {
    @Id
    String id;

    String name;
    String phone;
    String email;

    String province;
    String district;
    String ward;
    String address;

    @Column(columnDefinition = "TEXT")
    String customerNote;

    @Column(columnDefinition = "TEXT")
    String adminNote;

    @Enumerated(EnumType.STRING)
    OrderShippingMethod shippingMethod;

    @Enumerated(EnumType.STRING)
    OrderPaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    OrderStatus status;

    @Enumerated(EnumType.STRING)
    OrderUserType useType;

    String couponCode;
    Integer couponDiscount;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @Transient
    Integer totalAmount;

    @Transient
    Integer temporaryAmount;

    @Transient
    Integer discountAmount;

    public Integer getTotalAmount() {
        return this.getTemporaryAmount() - this.getDiscountAmount();
    }

    public Integer getTemporaryAmount() {
        return this.getOrderItems()
                .stream()
                .mapToInt(orderItem -> orderItem.getPrice() * orderItem.getQuantity())
                .sum();
    }

    public Integer getDiscountAmount() {
        if (this.getCouponCode() == null || this.getCouponCode().isBlank()) {
            return 0;
        }
        return this.getTemporaryAmount() * this.getCouponDiscount() / 100;
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

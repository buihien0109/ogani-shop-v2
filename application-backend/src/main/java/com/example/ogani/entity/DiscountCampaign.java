package com.example.ogani.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.example.ogani.model.enums.DiscountType;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "discount_campaigns")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DiscountCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String name;
    String slug;

    @Column(columnDefinition = "TEXT")
    String description;

    @Enumerated(EnumType.STRING)
    DiscountType type;

    Integer value;

    Boolean status;

    LocalDateTime startDate;
    LocalDateTime endDate;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "discounts", fetch = FetchType.LAZY)
    @Fetch(FetchMode.SUBSELECT)
    Set<Product> products = new LinkedHashSet<>();

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

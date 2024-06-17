package com.example.ogani.repository;

import com.example.ogani.entity.DiscountCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiscountCampaignRepository extends JpaRepository<DiscountCampaign, Integer> {
    @Modifying
    @Query(value = "DELETE FROM product_discount WHERE discount_id = :campaignId", nativeQuery = true)
    void deleteProductsByCampaignId(@Param("campaignId") Integer campaignId);
}
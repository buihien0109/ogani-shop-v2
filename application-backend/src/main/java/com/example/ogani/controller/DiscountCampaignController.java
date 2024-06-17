package com.example.ogani.controller;

import com.example.ogani.model.request.CreateDiscountCampaignRequest;
import com.example.ogani.model.request.UpdateDiscountCampaingRequest;
import com.example.ogani.service.DiscountCampaingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class DiscountCampaignController {
    private final DiscountCampaingService discountCampaingService;

    @GetMapping("/admin/discount-campaigns")
    public ResponseEntity<?> getAllDiscountCampaigns() {
        return ResponseEntity.ok().body(discountCampaingService.getAllDiscountCampaigns());
    }

    @GetMapping("/admin/discount-campaigns/{id}")
    public ResponseEntity<?> getDiscountCampaignById(@PathVariable Integer id) {
        return ResponseEntity.ok().body(discountCampaingService.getDiscountCampaignById(id));
    }

    @PostMapping("/admin/discount-campaigns")
    public ResponseEntity<?> createDiscountCampaign(@Valid @RequestBody CreateDiscountCampaignRequest request) {
        return ResponseEntity.ok().body(discountCampaingService.createDiscountCampaign(request));
    }

    @PutMapping("/admin/discount-campaigns/{id}")
    public ResponseEntity<?> updateDiscountCampaign(@Valid @RequestBody UpdateDiscountCampaingRequest request,
                                                    @PathVariable Integer id) {
        return ResponseEntity.ok().body(discountCampaingService.updateDiscountCampaign(id, request));
    }

    @DeleteMapping("/admin/discount-campaigns/{id}")
    public ResponseEntity<?> deleteDiscountCampaign(@PathVariable Integer id) {
        discountCampaingService.deleteDiscountCampaign(id);
        return ResponseEntity.ok().build();
    }
}

package com.example.ogani.controller;

import com.example.ogani.model.request.SortBannerRequest;
import com.example.ogani.model.request.UpsertBannerRequest;
import com.example.ogani.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;

    @GetMapping("/public/banners")
    public ResponseEntity<?> getAllBannersActive() {
        return ResponseEntity.ok(bannerService.getAllBannersActive());
    }

    @GetMapping("/admin/banners")
    public ResponseEntity<?> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    @GetMapping("/admin/banners/active")
    public ResponseEntity<?> getAllBannersActiveByAdmin() {
        return ResponseEntity.ok(bannerService.getAllBannersActiveByAdmin());
    }

    @GetMapping("/admin/banners/{id}")
    public ResponseEntity<?> getBannerById(@PathVariable Integer id) {
        return ResponseEntity.ok(bannerService.getBannerById(id));
    }

    @PostMapping("/admin/banners")
    public ResponseEntity<?> createBanner(@RequestBody UpsertBannerRequest request) {
        return ResponseEntity.ok(bannerService.createBanner(request));
    }

    @PutMapping("/admin/banners/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Integer id, @RequestBody UpsertBannerRequest request) {
        return ResponseEntity.ok(bannerService.updateBanner(id, request));
    }

    @DeleteMapping("/admin/banners/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Integer id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/banners/sort")
    public ResponseEntity<?> sortBanners(@RequestBody SortBannerRequest request) {
        log.info("Request: {}", request);
        bannerService.sortBanners(request);
        return ResponseEntity.ok().build();
    }
}

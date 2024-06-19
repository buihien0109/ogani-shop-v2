package com.example.ogani.controller;

import com.example.ogani.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @RequestMapping("/admin/dashboard")
    public ResponseEntity<?> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}

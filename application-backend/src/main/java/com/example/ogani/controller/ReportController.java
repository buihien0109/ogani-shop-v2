package com.example.ogani.controller;

import com.example.ogani.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @RequestMapping("/admin/reports")
    public ResponseEntity<?> getReportData(@RequestParam(required = false) String start,
                                           @RequestParam(required = false) String end) {
        return ResponseEntity.ok(reportService.getReportData(start, end));
    }
}

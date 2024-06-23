package com.example.ogani.controller;

import com.example.ogani.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/public/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<?> getAddress(@RequestParam String provinceCode,
                                        @RequestParam String districtCode,
                                        @RequestParam String wardCode) {
        return ResponseEntity.ok(addressService.getAddress(provinceCode, districtCode, wardCode));
    }

    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinces() {
        return ResponseEntity.ok(addressService.getProvinces());
    }

    @GetMapping("/provinces/{code}")
    public ResponseEntity<?> getProvinceByCode(@PathVariable String code) {
        return ResponseEntity.ok(addressService.getProvinceByCode(code));
    }

    @GetMapping("/districts")
    public ResponseEntity<?> getDistricts(@RequestParam(required = false) Optional<String> provinceCode) {
        return ResponseEntity.ok(addressService.getDistricts(provinceCode));
    }

    @GetMapping("/districts/{code}")
    public ResponseEntity<?> getDistrictByCode(@PathVariable String code) {
        return ResponseEntity.ok(addressService.getDistrictByCode(code));
    }

    @GetMapping("/wards")
    public ResponseEntity<?> getWards(@RequestParam(required = false) Optional<String> districtCode) {
        return ResponseEntity.ok(addressService.getWards(districtCode));
    }
}

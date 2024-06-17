package com.example.ogani.controller;

import com.example.ogani.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/user-address")
@RequiredArgsConstructor
public class UserAddressController {
    private final UserAddressService userAddressService;
    @GetMapping
    public ResponseEntity<?> getAddressesByUser(@RequestParam Integer userId) {
        return ResponseEntity.ok(userAddressService.getAddressesByUser(userId));
    }
}

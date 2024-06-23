package com.example.ogani.controller;

import com.example.ogani.model.request.UpsertUserAddressRequest;
import com.example.ogani.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user-address")
@RequiredArgsConstructor
public class UserAddressController {
    private final UserAddressService userAddressService;
    @GetMapping
    public ResponseEntity<?> getAddressesByUser(@RequestParam Integer userId) {
        return ResponseEntity.ok(userAddressService.getAddressesByUser(userId));
    }

    @PostMapping
    public ResponseEntity<?> createUserAddress(@Valid @RequestBody UpsertUserAddressRequest request) {
        return ResponseEntity.ok(userAddressService.createUserAddress(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserAddress(@PathVariable Integer id, @Valid @RequestBody UpsertUserAddressRequest request) {
        return ResponseEntity.ok(userAddressService.updateUserAddress(id, request));
    }

    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefaultUserAddress(@PathVariable Integer id) {
        return ResponseEntity.ok(userAddressService.setDefaultUserAddress(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserAddress(@PathVariable Integer id) {
        userAddressService.deleteUserAddress(id);
        return ResponseEntity.ok().build();
    }
}

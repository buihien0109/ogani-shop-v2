package com.example.ogani.controller;

import com.example.ogani.entity.Favorite;
import com.example.ogani.model.request.AddFavoriteRequest;
import com.example.ogani.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping("/favorites/check-in-favorite")
    public ResponseEntity<?> checkProductExistsInFavorite(@RequestParam Integer productId) {
        Boolean isExists = favoriteService.checkProductExistsInFavorite(productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isExists", isExists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites() {
        return ResponseEntity.ok(favoriteService.getFavorites());
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addToFavorite(@Valid @RequestBody AddFavoriteRequest request) {
        return ResponseEntity.ok(favoriteService.addToFavorite(request));
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<?> deleteFromFavorite(@RequestParam Integer productId) {
        favoriteService.deleteFromFavorite(productId);
        return ResponseEntity.noContent().build();
    }
}

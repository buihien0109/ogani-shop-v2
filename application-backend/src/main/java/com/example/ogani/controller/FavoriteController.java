package com.example.ogani.controller;

import com.example.ogani.entity.Favorite;
import com.example.ogani.model.request.AddFavoriteRequest;
import com.example.ogani.model.request.AddToCartRequest;
import com.example.ogani.service.CartService;
import com.example.ogani.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping("/favorites/check-in-favorite")
    public ResponseEntity<?> checkMovieInFavorite(@RequestParam Integer movieId) {
        Boolean isExists = favoriteService.checkProductExistsInFavorite(movieId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isExists", isExists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavoritesByCurrentUser(@RequestParam(required = false, defaultValue = "1") Integer page,
                                                       @RequestParam(required = false, defaultValue = "12") Integer limit) {
        return ResponseEntity.ok(favoriteService.getFavoritesByCurrentUser(page, limit));
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addToFavorite(@Valid @RequestBody AddFavoriteRequest request) {
        Favorite favorite = favoriteService.addToFavorite(request);
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<?> deleteFromFavorite(@RequestParam Integer movieId) {
        favoriteService.deleteFromFavorite(movieId);
        return ResponseEntity.noContent().build();
    }
}

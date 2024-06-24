package com.example.ogani.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateCartItemRequest {
    @NotNull(message = "Số lượng không được để trống")
    Integer quantity;
}

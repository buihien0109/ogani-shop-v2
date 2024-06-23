package com.example.ogani.model.request;

import com.example.ogani.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminUpdateOrderRequest {
    String adminNote;

    @NotNull(message = "Trạng thái không được để trống")
    OrderStatus status;
}

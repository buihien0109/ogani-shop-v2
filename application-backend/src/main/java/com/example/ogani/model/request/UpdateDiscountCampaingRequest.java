package com.example.ogani.model.request;

import com.example.ogani.model.enums.DiscountType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateDiscountCampaingRequest {
    @NotEmpty(message = "Tên không được để trống")
    String name;

    @NotEmpty(message = "Mô tả không được để trống")
    String description;

    @NotNull(message = "Loại giảm giá không được để trống")
    DiscountType type;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    Integer value;

    @NotNull(message = "Trạng thái không được để trống")
    Boolean status;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    LocalDateTime endDate;

    List<Integer> productIds;
}

package com.example.ogani.model.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertUserAddressRequest {
    @NotEmpty(message = "Tỉnh/Thành phố không được để trống")
    String provinceCode;

    @NotEmpty(message = "Quận/Huyện không được để trống")
    String districtCode;

    @NotEmpty(message = "Phường/Xã không được để trống")
    String wardCode;

    @NotEmpty(message = "Địa chỉ không được để trống")
    String detail;

    @NotNull(message = "Mặc định không được để trống")
    Boolean isDefault;
}
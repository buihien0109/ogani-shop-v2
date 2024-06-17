package com.example.ogani.model.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertBannerRequest {
    @NotEmpty(message = "Tên không được để trống")
    String name;

    @NotEmpty(message = "Link không được để trống")
    String linkRedirect;

    String thumbnail;

    @NotEmpty(message = "Mô tả không được để trống")
    Boolean status;
}

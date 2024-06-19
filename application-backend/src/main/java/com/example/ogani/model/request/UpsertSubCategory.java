package com.example.ogani.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpsertSubCategory {
    @NotNull(message = "Danh mục cha không được để trống")
    Integer parentId;

    @NotNull(message = "Tên không được để trống")
    String name;
}

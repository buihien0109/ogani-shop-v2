package com.example.ogani.model.response;

import com.example.ogani.entity.District;
import com.example.ogani.entity.Province;
import com.example.ogani.entity.Ward;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {
    private Province province;
    private District district;
    private Ward ward;
}

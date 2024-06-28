package com.example.ogani.model.request;

import com.example.ogani.model.enums.OrderPaymentMethod;
import com.example.ogani.model.enums.OrderShippingMethod;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminCreateOrderRequest {
    Integer userId;

    @NotEmpty(message = "Tên không được để trống")
    String name;

    @NotEmpty(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "0[0-9]{9}", message = "Số điện thoại không hợp lệ")
    String phone;

    @NotEmpty(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email;

    @NotEmpty(message = "Tỉnh/Thành phố không được để trống")
    String provinceCode;

    @NotEmpty(message = "Quận/Huyện không được để trống")
    String districtCode;

    @NotEmpty(message = "Phường/Xã không được để trống")
    String wardCode;

    @NotEmpty(message = "Địa chỉ không được để trống")
    String address;

    String customerNote;
    String adminNote;

    @NotNull(message = "Phương thức vận chuyển không được để trống")
    OrderShippingMethod shippingMethod;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    OrderPaymentMethod paymentMethod;

    String couponCode;
    Integer couponDiscount;

    @NotNull(message = "Danh sách sản phẩm không được để trống")
    List<OrderItemRequest> items;
}

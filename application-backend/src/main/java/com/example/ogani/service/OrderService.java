package com.example.ogani.service;

import com.example.ogani.entity.*;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.enums.OrderStatus;
import com.example.ogani.model.enums.OrderUserType;
import com.example.ogani.model.enums.ProductStatus;
import com.example.ogani.model.request.AdminCreateOrderRequest;
import com.example.ogani.model.request.AdminUpdateOrderRequest;
import com.example.ogani.repository.*;
import com.github.dockerjava.api.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public List<Order> getOrdersByUserId(Integer id) {
        return orderRepository.findByUser_Id(id, Sort.by("createdAt").descending());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by("createdAt").descending());
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng có id: " + id));
    }

    @Transactional
    public Order createOrderByAdmin(AdminCreateOrderRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id: " + request.getUserId()));
        }

        Province province = provinceRepository.findById(request.getProvinceCode())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tỉnh/thành phố có mã: " + request.getProvinceCode()));

        District district = districtRepository.findById(request.getDistrictCode())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quận/huyện có mã: " + request.getDistrictCode()));

        Ward ward = wardRepository.findById(request.getWardCode())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã có mã: " + request.getWardCode()));

        Order order = Order.builder()
                .id(generateOrderId())
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(province)
                .district(district)
                .ward(ward)
                .address(request.getAddress())
                .customerNote(request.getCustomerNote())
                .adminNote(request.getAdminNote())
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
                .couponCode(request.getCouponCode())
                .couponDiscount(request.getCouponDiscount())
                .status(OrderStatus.WAIT)
                .useType(user != null ? OrderUserType.USER : OrderUserType.ANONYMOUS)
                .user(user)
                .orderItems(new ArrayList<>())
                .build();

        request.getItems().forEach(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id: " + item.getProductId()));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " không đủ số lượng");
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(product.getPrice())
                    .build();
            order.addOrderItem(orderItem);

            // update product quantity
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setStatus(ProductStatus.UNAVAILABLE);
            }
            productRepository.save(product);
        });
        return orderRepository.save(order);
    }

    private String generateOrderId() {
        Random random = new Random();
        return String.valueOf(random.nextInt(90000000) + 10000000);
    }

    @Transactional
    public Order updateOrderByAdmin(String id, AdminUpdateOrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng có id: " + id));

        order.setAdminNote(request.getAdminNote());
        order.setStatus(request.getStatus());

        if (request.getStatus() == OrderStatus.CANCELED || request.getStatus() == OrderStatus.RETURNED) {
            order.getOrderItems().forEach(orderItem -> {
                Product product = orderItem.getProduct();
                product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
                productRepository.save(product);
            });
        }
        return orderRepository.save(order);
    }
}

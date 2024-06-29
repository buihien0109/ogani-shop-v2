package com.example.ogani.service;

import com.example.ogani.entity.*;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.enums.OrderStatus;
import com.example.ogani.model.enums.OrderUserType;
import com.example.ogani.model.enums.ProductStatus;
import com.example.ogani.model.request.AdminCreateOrderRequest;
import com.example.ogani.model.request.AdminUpdateOrderRequest;
import com.example.ogani.model.request.CustomerCreateOrderRequest;
import com.example.ogani.model.request.OrderItemRequest;
import com.example.ogani.model.response.AddressResponse;
import com.example.ogani.model.response.PaymentResponse;
import com.example.ogani.repository.*;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final AddressService addressService;
    private final PaymentService paymentService;

    public List<Order> getOrdersByCurrentUser() {
        User user = SecurityUtils.getCurrentUserLogin();
        return orderRepository.findByUser_Id(user.getId(), Sort.by("createdAt").descending());
    }

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
    public PaymentResponse createOrderByAnonymousCustomer(CustomerCreateOrderRequest request) {
        AddressResponse addressResponse = addressService
                .getAddress(request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());

        Order order = Order.builder()
                .id(generateOrderId())
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(addressResponse.getProvince())
                .district(addressResponse.getDistrict())
                .ward(addressResponse.getWard())
                .address(request.getAddress())
                .customerNote(request.getCustomerNote())
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
                .couponCode(request.getCouponCode())
                .couponDiscount(request.getCouponDiscount())
                .status(OrderStatus.WAIT)
                .useType(OrderUserType.ANONYMOUS)
                .orderItems(new ArrayList<>())
                .build();

        addItemsToOrder(request.getItems(), order);

        // Update coupon
        updateCoupon(order);

        Order savedOrder = orderRepository.save(order);
        return paymentService.pay(savedOrder);
    }

    @Transactional
    public PaymentResponse createOrderByCustomer(CustomerCreateOrderRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        AddressResponse addressResponse = addressService
                .getAddress(request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());

        Order order = Order.builder()
                .id(generateOrderId())
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(addressResponse.getProvince())
                .district(addressResponse.getDistrict())
                .ward(addressResponse.getWard())
                .address(request.getAddress())
                .customerNote(request.getCustomerNote())
                .shippingMethod(request.getShippingMethod())
                .paymentMethod(request.getPaymentMethod())
                .couponCode(request.getCouponCode())
                .couponDiscount(request.getCouponDiscount())
                .status(OrderStatus.WAIT)
                .useType(OrderUserType.USER)
                .user(user)
                .orderItems(new ArrayList<>())
                .build();

        addItemsToOrder(request.getItems(), order);
        updateCoupon(order);
        clearItemInCart(user);

        Order savedOrder = orderRepository.save(order);
        return paymentService.pay(savedOrder);
    }

    public Order cancelOrderByCustomer(String id) {
        User user = SecurityUtils.getCurrentUserLogin();

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng có id: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không thể hủy đơn hàng của người khác");
        }

        if (order.getStatus() != OrderStatus.WAIT) {
            throw new BadRequestException("Không thể hủy đơn hàng đã được xử lý");
        }

        order.setStatus(OrderStatus.CANCELED);
        order.getOrderItems().forEach(orderItem -> {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        });

        return orderRepository.save(order);
    }

    @Transactional
    public Order createOrderByAdmin(AdminCreateOrderRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id: " + request.getUserId()));
        }

        AddressResponse addressResponse = addressService
                .getAddress(request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());

        Order order = Order.builder()
                .id(generateOrderId())
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(addressResponse.getProvince())
                .district(addressResponse.getDistrict())
                .ward(addressResponse.getWard())
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

        addItemsToOrder(request.getItems(), order);
        return orderRepository.save(order);
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

    private String generateOrderId() {
        Random random = new Random();
        return String.valueOf(random.nextInt(90000000) + 10000000);
    }

    private void addItemsToOrder(List<OrderItemRequest> request, Order order) {
        request.forEach(item -> {
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
    }

    private void updateCoupon(Order order) {
        if (order.getCouponCode() != null) {
            Coupon coupon = couponRepository.findByCode(order.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá: " + order.getCouponCode()));
            if (coupon.getUsed() >= coupon.getQuantity()) {
                throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
            }
            if (coupon.getEndDate().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Mã giảm giá đã hết hạn");
            }
            coupon.setUsed(coupon.getUsed() + 1);
            couponRepository.save(coupon);
        }
    }

    private void clearItemInCart(User user) {
        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng của user"));

        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id " + orderId));
        order.setStatus(status);
        orderRepository.save(order);
    }
}

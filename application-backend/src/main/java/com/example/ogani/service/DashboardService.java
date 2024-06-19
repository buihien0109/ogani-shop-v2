package com.example.ogani.service;

import com.example.ogani.entity.*;
import com.example.ogani.model.dto.ExpenseDto;
import com.example.ogani.model.dto.RevenueDto;
import com.example.ogani.model.dto.RevenueExpenseDto;
import com.example.ogani.model.enums.OrderStatus;
import com.example.ogani.repository.BlogRepository;
import com.example.ogani.repository.OrderRepository;
import com.example.ogani.repository.PaymentVoucherRepository;
import com.example.ogani.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final PaymentVoucherRepository paymentVoucherRepository;

    public Map<String, Object> getDashboardData() {
        return Map.of(
                "newOrders", countNewOrdersInCurrentMonth(),
                "newUsers", countNewUsersInCurrentMonth(),
                "newBlogs", countNewBlogsInCurrentMonth(),
                "totalRevenue", calculateOrderRevenueByCurrentMonth(),
                "totalPayment", calculateTotalPaymentVoucherByCurrentMonth(),
                "latestOrders", getOrderLatestByCurrentMonth(10),
                "latestUsers", getUserLatestByCurrentMonth(10),
                "bestSellingProducts", getBestSellingProductByCurrentMonth(5),
                "revenueAndExpenseList", getRevenueExpenseByMonth(5)
        );
    }

    public Map<String, LocalDateTime> getTimeRangeInCurrentMonth() {
        LocalDateTime firstDayOfMonth = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();
        LocalDateTime lastDayOfMonth = LocalDate.now()
                .with(TemporalAdjusters.lastDayOfMonth())
                .atStartOfDay();

        return Map.of("start", firstDayOfMonth, "end", lastDayOfMonth);
    }

    public long countNewOrdersInRangeTime(LocalDateTime start, LocalDateTime end) {
        return orderRepository.countByCreatedAtBetween(start, end);
    }

    public long countNewUsersInRangeTime(LocalDateTime start, LocalDateTime end) {
        return userRepository.countByCreatedAtBetween(start, end);
    }

    public long countNewBlogsInRangeTime(LocalDateTime start, LocalDateTime end) {
        return blogRepository.countByCreatedAtBetween(start, end);
    }

    public Integer calculateOrderRevenueInRangeTime(LocalDateTime start, LocalDateTime end) {
        return orderRepository
                .findByCreatedAtBetweenAndStatus(start, end, OrderStatus.COMPLETE)
                .stream()
                .mapToInt(Order::getTotalAmount)
                .sum();
    }

    public Integer calculateTotalPaymentVoucherInRangeTime(LocalDateTime start, LocalDateTime end) {
        return paymentVoucherRepository
                .findByCreatedAtBetween(start, end)
                .stream()
                .mapToInt(PaymentVoucher::getAmount)
                .sum();
    }

    public List<Order> getOrderLatestInRangeTime(LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }

    public List<User> getUserLatestInRangeTime(LocalDateTime start, LocalDateTime end) {
        return userRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }

    public List<Map<String, Object>> getBestSellingProductInRangeTime(LocalDateTime start, LocalDateTime end) {
        // get all orders in current month has status COMPLETED
        List<Order> orders = orderRepository
                .findByCreatedAtBetweenAndStatus(start, end, OrderStatus.COMPLETE);

        // get all order items in orders
        List<OrderItem> orderItems = orders.stream()
                .flatMap(orderTable -> orderTable.getOrderItems().stream()).toList();

        // group by product id and sum quantity
        Map<Integer, Integer> productQuantityMap = orderItems.stream()
                .collect(Collectors.groupingBy(orderItem -> orderItem.getProduct().getId(),
                        Collectors.summingInt(OrderItem::getQuantity)));

        // sort by quantity
        List<Map.Entry<Integer, Integer>> sortedProductQuantityList = productQuantityMap
                .entrySet()
                .stream()
                .sorted((o1, o2) -> o2.getValue().compareTo(o1.getValue())).toList();

        // get top product
        List<Integer> topProductIdList = sortedProductQuantityList.stream().map(Map.Entry::getKey).toList();

        // get product info
        List<Product> topProductList = topProductIdList.stream()
                .map(productId -> orderItems.stream()
                        .filter(orderItem -> orderItem.getProduct().getId().equals(productId))
                        .findFirst()
                        .map(OrderItem::getProduct)
                        .get())
                .toList();

        // get result
        return topProductList.stream()
                .map(product -> {
                    Map<String, Object> map = Map.of(
                            "id", product.getId(),
                            "name", product.getName(),
                            "price", product.getPrice(),
                            "quantity", productQuantityMap.get(product.getId())
                    );
                    return map;
                })
                .toList();

    }

    // count all new orders in current month
    public long countNewOrdersInCurrentMonth() {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return countNewOrdersInRangeTime(timeRange.get("start"), timeRange.get("end"));
    }

    // count all new users in current month
    public long countNewUsersInCurrentMonth() {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return countNewUsersInRangeTime(timeRange.get("start"), timeRange.get("end"));
    }

    // count all new blogs in current month
    public long countNewBlogsInCurrentMonth() {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return countNewBlogsInRangeTime(timeRange.get("start"), timeRange.get("end"));
    }

    // Calculate order revenue by current month
    public Integer calculateOrderRevenueByCurrentMonth() {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return calculateOrderRevenueInRangeTime(timeRange.get("start"), timeRange.get("end"));
    }

    // Calculate total payment voucher by current month
    public Integer calculateTotalPaymentVoucherByCurrentMonth() {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return calculateTotalPaymentVoucherInRangeTime(timeRange.get("start"), timeRange.get("end"));
    }

    // Get N order latest by current month
    public List<Order> getOrderLatestByCurrentMonth(Integer limit) {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return getOrderLatestInRangeTime(timeRange.get("start"), timeRange.get("end"))
                .stream().limit(limit).toList();
    }

    // Get N user latest by current month
    public List<User> getUserLatestByCurrentMonth(Integer limit) {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return getUserLatestInRangeTime(timeRange.get("start"), timeRange.get("end"))
                .stream().limit(limit).toList();
    }

    // Take the n products with the highest sales volume in the month, only counting orders with status as COMPLETE
    // Return List<Map<String, Object>>: productId, productName, quantity
    public List<Map<String, Object>> getBestSellingProductByCurrentMonth(Integer limit) {
        Map<String, LocalDateTime> timeRange = getTimeRangeInCurrentMonth();
        return getBestSellingProductInRangeTime(timeRange.get("start"), timeRange.get("end"))
                .stream().limit(limit).toList();
    }

    // Tính doanh 5 tháng gần nhất List<RevenueDto>
    public List<RevenueDto> getRevenueByMonth(Integer limit) {
        List<RevenueDto> renvenueDtoList = orderRepository.findRevenueByMonth();
        if (renvenueDtoList.size() > limit) {
            int start = renvenueDtoList.size() - limit;
            int end = renvenueDtoList.size();
            return renvenueDtoList.subList(start, end);
        }
        return renvenueDtoList;
    }

    // Tính chi phí của 5 tháng gần nhất List<RevenueDto>
    public List<ExpenseDto> getExpenseByMonth(Integer limit) {
        List<ExpenseDto> expenseDtoList = paymentVoucherRepository.findExpenseByMonth();
        if (expenseDtoList.size() > limit) {
            int start = expenseDtoList.size() - limit;
            int end = expenseDtoList.size();
            return expenseDtoList.subList(start, end);
        }
        return expenseDtoList;
    }

    public List<RevenueExpenseDto> getRevenueExpenseByMonth(int limit) {
        List<RevenueDto> renvenueDtoList = orderRepository.findRevenueByMonth();
        List<ExpenseDto> expenseDtoList = paymentVoucherRepository.findExpenseByMonth();

        // Merge 2 list -> List<RevenueExpenseDto>
        List<RevenueExpenseDto> result = new ArrayList<>(renvenueDtoList.stream()
                .map(revenueDto -> {
                    ExpenseDto expenseDto = expenseDtoList.stream()
                            .filter(expenseDto1 -> expenseDto1.getMonth() == revenueDto.getMonth() && expenseDto1.getYear() == revenueDto.getYear())
                            .findFirst()
                            .orElse(new ExpenseDto(revenueDto.getMonth(), revenueDto.getYear(), 0));
                    return new RevenueExpenseDto(revenueDto.getMonth(), revenueDto.getYear(), revenueDto.getRevenue(), expenseDto.getExpense());
                })
                .toList());

        // Sort by year and month
        result.sort((o1, o2) -> {
            if (o1.getYear() == o2.getYear()) {
                return o1.getMonth() - o2.getMonth();
            }
            return o1.getYear() - o2.getYear();
        });

        // Get the last n elements
        if (result.size() > limit) {
            int start = result.size() - limit;
            int end = result.size();
            return result.subList(start, end);
        }
        return result;
    }
}


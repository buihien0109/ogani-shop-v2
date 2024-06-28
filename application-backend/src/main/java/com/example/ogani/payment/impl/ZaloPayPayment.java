package com.example.ogani.payment.impl;

import com.example.ogani.entity.Order;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.model.response.PaymentResponse;
import com.example.ogani.payment.PaymentStrategy;
import com.example.ogani.payment.config.ZaloPayConfig;
import com.example.ogani.payment.utils.zalopay.HMACUtil;
import com.example.ogani.payment.utils.zalopay.ZaloPayUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ZaloPayPayment implements PaymentStrategy {
    private final ZaloPayConfig config;
    private final RestTemplate restTemplate;
    private final ZaloPayUtil zaloPayUtil;
    private final ObjectMapper objectMapper;
    private final Environment environment;

    @Value("${app.backend.host}")
    private String backendHost;

    @Value("${app.backend.expose_port}")
    private String backendExposePort;

    @Value("${app.frontend.host}")
    private String frontendHost;

    @Value("${app.frontend.port}")
    private String frontendPort;

    private boolean isDevEnvironment() {
        String[] activeProfiles = environment.getActiveProfiles();
        for (String profile : activeProfiles) {
            if ("dev".equals(profile)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public PaymentResponse pay(Order order) {
        String orderId = order.getId();

        String redirectUrl = "%s:%s/xac-nhan-don-hang/%s".formatted(frontendHost, frontendPort, orderId);
        String callbackUrl;
        if (isDevEnvironment()) {
            callbackUrl = "https://7121-2402-800-6172-2720-d1a1-5e39-e0ff-72da.ngrok-free.app/api/public/payments/zalopay/callback";
        } else {
            callbackUrl = "%s:%s/api/public/payments/zalopay/callback".formatted(backendHost, backendExposePort);
        }

        final Map<String, String> embedData = Map.of("redirecturl", redirectUrl);

        final List<Map<String, Object>> items = new ArrayList<>();
        order.getOrderItems().forEach(orderItem -> {
            items.add(new HashMap<>() {{
                put("id", orderItem.getProduct().getId());
                put("item", orderItem.getProduct().getName());
                put("quantity", orderItem.getQuantity());
                put("amount", orderItem.getPrice() * orderItem.getQuantity());
            }});
        });

        Map<String, Object> orderPayment = new HashMap<>() {{
            put("app_id", config.getApp_id());
            put("app_trans_id", zaloPayUtil.getCurrentTimeString("yyMMdd") + "_" + orderId);
            put("app_time", System.currentTimeMillis());
            put("app_user", "user123");
            put("amount", order.getTotalAmount());
            put("description", "Thanh toán cho đơn hàng #" + orderId);
            put("bank_code", "");
            put("item", zaloPayUtil.toJson(items));
            put("embed_data", zaloPayUtil.toJson(embedData));
            put("callback_url", callbackUrl);
        }};

        // app_id +”|”+ app_trans_id +”|”+ appuser +”|”+ amount +"|" + app_time +”|”+ embed_data +"|" +item
        StringBuilder dataBuilder = new StringBuilder();
        dataBuilder.append(orderPayment.get("app_id")).append("|")
                .append(orderPayment.get("app_trans_id")).append("|")
                .append(orderPayment.get("app_user")).append("|")
                .append(orderPayment.get("amount")).append("|")
                .append(orderPayment.get("app_time")).append("|")
                .append(orderPayment.get("embed_data")).append("|")
                .append(orderPayment.get("item"));

        String data = dataBuilder.toString();
        orderPayment.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKey1(), data));

        try {
            log.info("orderPayment: {}", orderPayment);

            // Chuẩn bị các headers cho yêu cầu
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Chuẩn bị body cho yêu cầu
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            for (Map.Entry<String, Object> entry : orderPayment.entrySet()) {
                requestBody.add(entry.getKey(), entry.getValue().toString());
            }

            // Tạo một HttpEntity object chứa headers và body
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Gửi yêu cầu POST và nhận phản hồi
            ResponseEntity<String> response = restTemplate.postForEntity(config.getEndpoint(), requestEntity, String.class);
            log.info("Response from ZaloPay: {}", response);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Successful response from ZaloPay: {}", response.getBody());
                Map<String, Object> resultMap = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {
                });
                return PaymentResponse.builder()
                        .url(resultMap.get("order_url").toString())
                        .build();
            } else {
                log.error("Failed to get a successful response from ZaloPay");
                throw new BadRequestException("Failed to get a successful response from ZaloPay");
            }
        } catch (Exception e) {
            log.error("Exception: {}", e.getMessage());
            throw new BadRequestException("Failed to get a successful response from ZaloPay");
        }
    }
}



package com.example.ogani.payment.impl;

import com.example.ogani.entity.Order;
import com.example.ogani.model.response.PaymentResponse;
import com.example.ogani.payment.PaymentStrategy;
import com.example.ogani.payment.utils.momo.MomoUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class MomoPayment implements PaymentStrategy {
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
        try {
            // Các giá trị cấu hình của MoMo
            String accessKey = "F8BBA842ECF85";
            String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            String partnerCode = "MOMO";
            String redirectUrl = "%s:%s/xac-nhan-don-hang/%s".formatted(frontendHost, frontendPort, order.getId());
            String ipnUrl;
            if (isDevEnvironment()) {
                ipnUrl = "https://7121-2402-800-6172-2720-d1a1-5e39-e0ff-72da.ngrok-free.app/api/public/payments/momo/callback";
            } else {
                ipnUrl = "%s:%s/api/public/payments/momo/callback".formatted(backendHost, backendExposePort);
            }

            // Các giá trị yêu cầu
            String orderInfo = "Thanh toán đơn hàng #" + order.getId();
            String requestType = "payWithMethod";
            String amount = order.getTotalAmount().toString();
            String orderId = String.valueOf(order.getId());
            String requestId = orderId;
            String extraData = "";
            String orderGroupId = "";
            boolean autoCapture = true;
            String lang = "vi";

            // Danh sách item
            List<Map<String, Object>> items = new ArrayList<>();
            order.getOrderItems().forEach(orderItem -> {
                items.add(new HashMap<>() {{
                    put("id", orderItem.getProduct().getId());
                    put("name", orderItem.getProduct().getName());
                    put("imageUrl", orderItem.getProduct().getThumbnail().startsWith("/api")
                            ? "%s:%s%s".formatted(backendHost, backendExposePort, orderItem.getProduct().getThumbnail())
                            : orderItem.getProduct().getThumbnail()
                    );
                    put("price", orderItem.getPrice());
                    put("currency", "VND");
                    put("quantity", orderItem.getQuantity());
                    put("totalPrice", orderItem.getPrice() * orderItem.getQuantity());

                }});
            });

            // Thông tin người mua
            Map<String, Object> userInfo = new HashMap<>() {{
                put("name", order.getName());
                put("phoneNumber", order.getPhone());
                put("email", order.getEmail());
            }};

            // Tạo chữ ký HMAC SHA256
            String rawSignature = String.format(
                    "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                    accessKey, amount, extraData, ipnUrl, orderId, orderInfo, partnerCode, redirectUrl, requestId, requestType);
            log.info("Raw signature: {}", rawSignature);

            String signature = MomoUtil.signHmacSHA256(rawSignature, secretKey);
            log.info("Signature: {}", signature);

            // Chuẩn bị body yêu cầu
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", partnerCode);
            requestBody.put("partnerName", "Test");
            requestBody.put("storeId", "MomoTestStore");
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", redirectUrl);
            requestBody.put("ipnUrl", ipnUrl);
            requestBody.put("lang", lang);
            requestBody.put("requestType", requestType);
            requestBody.put("autoCapture", autoCapture);
            requestBody.put("extraData", extraData);
            requestBody.put("items", items);
            requestBody.put("userInfo", userInfo);
            requestBody.put("orderGroupId", orderGroupId);
            requestBody.put("signature", signature);

            // Convert requestBody to JSON string
            String requestBodyJson = new ObjectMapper().writeValueAsString(requestBody);
            log.info("Request body: {}", requestBodyJson);

            // Gửi yêu cầu HTTP đến endpoint của MoMo
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentLength(requestBodyJson.getBytes(StandardCharsets.UTF_8).length); // Thiết lập Content-Length

            HttpEntity<String> entity = new HttpEntity<>(requestBodyJson, headers);

            String url = "https://test-payment.momo.vn/v2/gateway/api/create";
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            log.info("Status: {}", response.getStatusCode());
            log.info("Headers: {}", response.getHeaders());
            log.info("Body: {}", response.getBody());

            // Phân tích phản hồi
            PaymentResponse paymentResponse = parsePaymentResponse(response.getBody());
            return paymentResponse;
        } catch (Exception e) {
            log.error("Payment with Momo failed: {}", e.getMessage());
            return null;
        }
    }

    private PaymentResponse parsePaymentResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            String payUrl = rootNode.path("payUrl").asText();

            return PaymentResponse.builder()
                    .url(payUrl)
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse payment response: {}", e.getMessage());
            return null;
        }
    }
}

package com.example.ogani.service;

import com.example.ogani.entity.Order;
import com.example.ogani.entity.PaymentVoucher;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.model.enums.OrderStatus;
import com.example.ogani.repository.OrderRepository;
import com.example.ogani.repository.PaymentVoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {
    private final OrderRepository orderRepository;
    private final PaymentVoucherRepository paymentVoucherRepository;

    public Map<String, Object> getReportData(String start, String end) {
        List<PaymentVoucher> paymentVouchers = getAllPaymentVouchers(start, end);
        return Map.of(
                "totalRevenue", calculateOrderRevenueAmount(start, end),
                "totalPayment", calculateTotalPaymentVoucherAmount(paymentVouchers),
                "orders", getAllOrders(start, end),
                "paymentVouchers", paymentVouchers,
                "startDate", getStartDate(start),
                "endDate", getEndDate(end)

        );
    }

    public LocalDateTime getStartDate(String startDateString) {
        log.info("Start date string: {}", startDateString);
        LocalDateTime startDate = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        if (startDateString != null) {
            try {
                startDate = LocalDateTime.parse(startDateString, DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
            } catch (DateTimeParseException e) {
                log.error("Error when parse start date: {}", e.getMessage());
            }
        }

        return startDate;
    }

    public LocalDateTime getEndDate(String endDateString) {
        log.info("End date string: {}", endDateString);
        LocalDateTime endDate = LocalDate.now()
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(23, 59, 59, 999);

        if (endDateString != null) {
            try {
                endDate = LocalDateTime.parse(endDateString, DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
            } catch (DateTimeParseException e) {
                log.error("Error when parse end date: {}", e.getMessage());
            }
        }

        return endDate;
    }

    private Map<String, LocalDateTime> getDate(String startDateString, String endDateString) {
        LocalDateTime startDate = getStartDate(startDateString);
        LocalDateTime endDate = getEndDate(endDateString);

        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date phải nhỏ hơn end date");
        }

        return Map.of("start", startDate, "end", endDate);
    }

    public List<Order> getAllOrders(String startDateString, String endDateString) {
        Map<String, LocalDateTime> dateMap = getDate(startDateString, endDateString);
        LocalDateTime start = dateMap.get("start");
        LocalDateTime end = dateMap.get("end");

        return orderRepository.findByCreatedAtBetweenAndStatus(start, end, OrderStatus.COMPLETE);
    }

    public List<PaymentVoucher> getAllPaymentVouchers(String startDateString, String endDateString) {
        Map<String, LocalDateTime> dateMap = getDate(startDateString, endDateString);
        LocalDateTime start = dateMap.get("start");
        LocalDateTime end = dateMap.get("end");

        return paymentVoucherRepository.findByCreatedAtBetween(start, end);
    }

    public Integer calculateOrderRevenueAmount(String startDateString, String endDateString) {
        Map<String, LocalDateTime> dateMap = getDate(startDateString, endDateString);
        LocalDateTime start = dateMap.get("start");
        LocalDateTime end = dateMap.get("end");

        return orderRepository
                .findByCreatedAtBetweenAndStatus(start, end, OrderStatus.COMPLETE)
                .stream()
                .mapToInt(Order::getTotalAmount)
                .sum();
    }

    public Integer calculateTotalPaymentVoucherAmount(String startDateString, String endDateString) {
        Map<String, LocalDateTime> dateMap = getDate(startDateString, endDateString);
        LocalDateTime start = dateMap.get("start");
        LocalDateTime end = dateMap.get("end");

        return paymentVoucherRepository
                .findByCreatedAtBetween(start, end)
                .stream()
                .mapToInt(PaymentVoucher::getAmount)
                .sum();
    }

    public Integer calculateTotalPaymentVoucherAmount(List<PaymentVoucher> paymentVouchers) {
        return paymentVouchers.stream()
                .mapToInt(PaymentVoucher::getAmount)
                .sum();
    }

    public byte[] generateReport(String startDateString, String endDateString) {
        try (Workbook workbook = new XSSFWorkbook()) {
            // Create CellStyle for title row
            CellStyle titleStyle = createTitleStyle(workbook);
            // Create CellStyle for date row
            CellStyle dateStyle = createDateStyle(workbook);
            // Create CellStyle for header row
            CellStyle headerStyle = createHeaderStyle(workbook);
            // Create CellStyle for data cells
            CellStyle dataStyle = createDataStyle(workbook);

            // Create "Báo cáo doanh thu" sheet
            Sheet revenueSheet = workbook.createSheet("Báo cáo doanh thu");
            createSheetHeaderOfRevenueSheet(revenueSheet, "Báo cáo doanh thu");
            List<Order> orderList = getAllOrders(startDateString, endDateString);
            createSheetContentOfRevenueSheet(revenueSheet, orderList);

            // Create "Báo cáo thu chi" sheet
            Sheet incomeExpenseSheet = workbook.createSheet("Báo cáo thu chi");
            createSheetHeaderOfIncomeExpenseSheet(incomeExpenseSheet, "Báo cáo thu chi");
            List<PaymentVoucher> paymentVoucherList = getAllPaymentVouchers(startDateString, endDateString);
            createSheetContentOfIncomeExpenseSheet(incomeExpenseSheet, paymentVoucherList);

            // Apply styles to the sheets
            applyStyles(revenueSheet, titleStyle, dateStyle, headerStyle, dataStyle);
            applyStyles(incomeExpenseSheet, titleStyle, dateStyle, headerStyle, dataStyle);

            // Write the workbook content to a ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);

            return outputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException("Có lỗi xảy ra khi tạo báo cáo: " + e.getMessage());
        }
    }

    private void createSheetHeaderOfRevenueSheet(Sheet sheet, String reportType) {
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

        int rowNum = 0;
        Row titleRow = sheet.createRow(rowNum++);
        titleRow.createCell(0).setCellValue(reportType);

        Row dateRow = sheet.createRow(rowNum++);
        dateRow.createCell(0).setCellValue("Thời gian: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));

        Row headerRow = sheet.createRow(rowNum);
        headerRow.createCell(0).setCellValue("Mã đơn");
        headerRow.createCell(1).setCellValue("Ngày đặt hàng");
        headerRow.createCell(2).setCellValue("Họ tên");
        headerRow.createCell(3).setCellValue("Số điện thoại");
        headerRow.createCell(4).setCellValue("Email");
        headerRow.createCell(5).setCellValue("Số tiền");
        headerRow.createCell(6).setCellValue("Trạng thái đơn hàng");
    }

    private void createSheetHeaderOfIncomeExpenseSheet(Sheet sheet, String reportType) {
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));

        int rowNum = 0;
        Row titleRow = sheet.createRow(rowNum++);
        titleRow.createCell(0).setCellValue(reportType);

        Row dateRow = sheet.createRow(rowNum++);
        dateRow.createCell(0).setCellValue("Thời gian: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));

        Row headerRow = sheet.createRow(rowNum);
        headerRow.createCell(0).setCellValue("Mã phiếu");
        headerRow.createCell(1).setCellValue("Ngày tạo");
        headerRow.createCell(2).setCellValue("Nội dung chi");
        headerRow.createCell(3).setCellValue("Số tiền");
        headerRow.createCell(4).setCellValue("Người tạo");
        headerRow.createCell(5).setCellValue("Ghi chú");
    }

    private void createSheetContentOfRevenueSheet(Sheet sheet, List<Order> orderList) {
        int rowNum = 3; // Starting row after title and header
        for (Order order : orderList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(order.getId());
            row.createCell(1).setCellValue(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            row.createCell(2).setCellValue(order.getName());
            row.createCell(3).setCellValue(order.getPhone());
            row.createCell(4).setCellValue(order.getEmail());
            row.createCell(5).setCellValue(order.getTotalAmount());
            row.createCell(6).setCellValue(order.getStatus().toString());
        }
    }

    private void createSheetContentOfIncomeExpenseSheet(Sheet sheet, List<PaymentVoucher> paymentVoucherList) {
        int rowNum = 3; // Starting row after title and header
        for (PaymentVoucher paymentVoucher : paymentVoucherList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(paymentVoucher.getId());
            row.createCell(1).setCellValue(paymentVoucher.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            row.createCell(2).setCellValue(paymentVoucher.getPurpose());
            row.createCell(3).setCellValue(paymentVoucher.getAmount());
            row.createCell(4).setCellValue(paymentVoucher.getUser().getName());
            row.createCell(5).setCellValue(paymentVoucher.getNote());
        }
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 16);
        font.setBold(true);
        font.setColor(IndexedColors.BLACK.getIndex());
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFont(font);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 12);
        font.setItalic(true);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFont(font);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 12);
        font.setBold(true);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFont(font);
        style.setBorderBottom(BorderStyle.MEDIUM);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 12);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setFont(font);
        return style;
    }

    private void applyStyles(Sheet sheet, CellStyle titleStyle, CellStyle dateStyle, CellStyle headerStyle, CellStyle dataStyle) {
        // Apply title style to the title row
        sheet.getRow(0).getCell(0).setCellStyle(titleStyle);

        // Apply date style to the date row
        sheet.getRow(1).getCell(0).setCellStyle(dateStyle);

        // Apply header style to the header row
        Row headerRow = sheet.getRow(2);
        for (int i = 0; i < headerRow.getPhysicalNumberOfCells(); i++) {
            headerRow.getCell(i).setCellStyle(headerStyle);
        }

        // Apply data style to all data cells
        for (int i = 3; i < sheet.getPhysicalNumberOfRows(); i++) {
            Row row = sheet.getRow(i);
            for (Cell cell : row) {
                cell.setCellStyle(dataStyle);
            }
        }
    }
}


package com.example.ogani.service;

import com.example.ogani.entity.Supplier;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertSupplierRequest;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.repository.SupplierRepository;
import com.example.ogani.repository.TransactionRepository;
import com.example.ogani.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + id));
    }

    public Supplier createSupplier(UpsertSupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .address(request.getAddress())
                .email(request.getEmail())
                .phone(request.getPhone())
                .thumbnail(StringUtils.generateLinkImage(request.getName()))
                .build();
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Integer id, UpsertSupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + id));

        supplier.setName(request.getName());
        supplier.setAddress(request.getAddress());
        supplier.setEmail(request.getEmail());
        supplier.setPhone(request.getPhone());
        supplier.setThumbnail(request.getThumbnail());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Integer id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id: " + id));

        // Kiểm tra xem nhà cung cấp đã nhập hàng chưa?
        if (transactionRepository.existsBySupplier_Id(supplier.getId())) {
            throw new BadRequestException("Nhà cung cấp đã nhập hàng, không thể xóa");
        }

        // Kiểm tra xem nhà cung cấp có sản phẩm nào không?
        if (productRepository.existsBySupplier_Id(supplier.getId())) {
            throw new BadRequestException("Nhà cung cấp có sản phẩm, không thể xóa");
        }

        supplierRepository.deleteById(id);
    }
}

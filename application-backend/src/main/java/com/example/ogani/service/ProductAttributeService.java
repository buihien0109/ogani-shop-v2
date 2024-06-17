package com.example.ogani.service;

import com.example.ogani.entity.Product;
import com.example.ogani.entity.ProductAttribute;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertProductAttributeRequest;
import com.example.ogani.repository.ProductAttributeRepository;
import com.example.ogani.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAttributeService {
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductRepository productRepository;

    public List<ProductAttribute> getAttributesByProduct(Integer productId) {
        return productAttributeRepository.findByProduct_Id(productId, Sort.by("createdAt").descending());
    }

    public ProductAttribute createAttribute(UpsertProductAttributeRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + request.getProductId()));

        ProductAttribute productAttribute = ProductAttribute.builder()
                .product(product)
                .name(request.getName())
                .value(request.getValue())
                .build();
        return productAttributeRepository.save(productAttribute);
    }

    public ProductAttribute updateAttribute(Integer id, UpsertProductAttributeRequest request) {
        ProductAttribute productAttribute = productAttributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thuộc tính sản phẩm có id = " + id));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + request.getProductId()));

        if (!productAttribute.getProduct().getId().equals(request.getProductId())) {
            throw new BadRequestException("Thuộc tính không thuộc sản phẩm này");
        }

        productAttribute.setProduct(product);
        productAttribute.setName(request.getName());
        productAttribute.setValue(request.getValue());
        return productAttributeRepository.save(productAttribute);
    }

    public void deleteAttribute(Integer id) {
        ProductAttribute productAttribute = productAttributeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thuộc tính sản phẩm có id = " + id));
        productAttributeRepository.delete(productAttribute);
    }
}

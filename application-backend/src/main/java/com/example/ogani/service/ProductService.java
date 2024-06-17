package com.example.ogani.service;

import com.example.ogani.entity.Category;
import com.example.ogani.entity.Product;
import com.example.ogani.entity.Supplier;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpdateProductImageRequest;
import com.example.ogani.model.request.UpdateProductQuantityRequest;
import com.example.ogani.model.request.UpsertProductRequest;
import com.example.ogani.repository.CategoryRepository;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.repository.SupplierRepository;
import com.example.ogani.utils.StringUtils;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final Slugify slugify;

    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by("createdAt").descending());
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + id));
    }

    public Product createProduct(UpsertProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + request.getCategoryId()));
        if (category.getParent() == null) {
            throw new BadRequestException("Danh mục không hợp lệ");
        }

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id " + request.getSupplierId()));

        Product product = Product.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .description(request.getDescription())
                .stockQuantity(request.getStockQuantity())
                .price(request.getPrice())
                .status(request.getStatus())
                .published(request.getPublished())
                .thumbnail(StringUtils.generateLinkImage(request.getName()))
                .subImages(new ArrayList<>())
                .category(category)
                .supplier(supplier)
                .build();

        return productRepository.save(product);
    }

    public Product updateProduct(Integer id, UpsertProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + request.getCategoryId()));
        if (category.getParent() == null) {
            throw new BadRequestException("Danh mục không hợp lệ");
        }

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà cung cấp với id " + request.getSupplierId()));

        product.setName(request.getName());
        product.setSlug(slugify.slugify(request.getName()));
        product.setDescription(request.getDescription());
        product.setStockQuantity(request.getStockQuantity());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus());
        product.setPublished(request.getPublished());
        product.setCategory(category);
        product.setSupplier(supplier);
        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + id));
        productRepository.delete(product);
    }

    public void updateImage(Integer id, UpdateProductImageRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + id));

        String thumbnail = request.getThumbnail();
        if (request.getThumbnail() == null || org.apache.commons.lang3.StringUtils.isBlank(request.getThumbnail())) {
            thumbnail = StringUtils.generateLinkImage(product.getName());
        }
        product.setThumbnail(thumbnail);
        product.setSubImages(request.getSubImages());
        productRepository.save(product);
    }

    public void updateProductQuantity(List<UpdateProductQuantityRequest> request) {
        if (request == null || request.isEmpty()) {
            throw new BadRequestException("Danh sách sản phẩm cần cập nhật số lượng không được trống");
        }
        for (UpdateProductQuantityRequest item : request) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id = " + item.getProductId()));

            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }
}
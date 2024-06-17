package com.example.ogani.service;

import com.example.ogani.entity.DiscountCampaign;
import com.example.ogani.entity.Product;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.CreateDiscountCampaignRequest;
import com.example.ogani.model.request.UpdateDiscountCampaingRequest;
import com.example.ogani.repository.DiscountCampaignRepository;
import com.example.ogani.repository.ProductRepository;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiscountCampaingService {
    private final ProductRepository productRepository;
    private final DiscountCampaignRepository discountCampaignRepository;
    private final Slugify slugify;

    public List<DiscountCampaign> getAllDiscountCampaigns() {
        return discountCampaignRepository.findAll(Sort.by("createdAt").descending());
    }

    public DiscountCampaign getDiscountCampaignById(Integer id) {
        return discountCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy discount campaign với id = " + id));
    }

    public DiscountCampaign createDiscountCampaign(CreateDiscountCampaignRequest request) {
        DiscountCampaign discountCampaign = DiscountCampaign.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .description(request.getDescription())
                .type(request.getType())
                .value(request.getValue())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return discountCampaignRepository.save(discountCampaign);
    }

    @Transactional
    public DiscountCampaign updateDiscountCampaign(Integer id, UpdateDiscountCampaingRequest request) {
        DiscountCampaign discountCampaign = discountCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy discount campaign với id = " + id));

        discountCampaign.setName(request.getName());
        discountCampaign.setSlug(slugify.slugify(request.getName()));
        discountCampaign.setDescription(request.getDescription());
        discountCampaign.setType(request.getType());
        discountCampaign.setValue(request.getValue());
        discountCampaign.setStatus(request.getStatus());
        discountCampaign.setStartDate(request.getStartDate());
        discountCampaign.setEndDate(request.getEndDate());

        discountCampaignRepository.deleteProductsByCampaignId(id);
        Set<Product> newProducts = new HashSet<>(productRepository.findAllById(request.getProductIds()));
        newProducts.forEach(product -> product.setDiscounts(Set.of(discountCampaign)));
        discountCampaign.setProducts(newProducts);

        discountCampaignRepository.save(discountCampaign);
        return discountCampaign;
    }

    public void deleteDiscountCampaign(Integer id) {
        DiscountCampaign discountCampaign = discountCampaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy discount campaign với id = " + id));
        discountCampaignRepository.delete(discountCampaign);
    }
}

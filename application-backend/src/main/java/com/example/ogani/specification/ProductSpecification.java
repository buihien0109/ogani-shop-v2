package com.example.ogani.specification;

import com.example.ogani.entity.Category;
import com.example.ogani.entity.DiscountCampaign;
import com.example.ogani.entity.Product;
import com.example.ogani.model.enums.ProductStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class ProductSpecification {

    public static Specification<Product> getProducts(String parentCategorySlug, String subCategorySlug) {
        log.info("parentCategorySlug: {}, subCategorySlug: {}", parentCategorySlug, subCategorySlug);

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.AVAILABLE));
            predicates.add(criteriaBuilder.isTrue(root.get("published")));

            if (parentCategorySlug != null && !parentCategorySlug.isEmpty()) {
                Join<Product, Category> categoryJoin = root.join("category");
                Join<Category, Category> parentCategoryJoin = categoryJoin.join("parent");
                predicates.add(criteriaBuilder.equal(parentCategoryJoin.get("slug"), parentCategorySlug));
            }

            if (subCategorySlug != null && !subCategorySlug.isEmpty()) {
                Join<Product, Category> categoryJoin = root.join("category");
                predicates.add(criteriaBuilder.equal(categoryJoin.get("slug"), subCategorySlug));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

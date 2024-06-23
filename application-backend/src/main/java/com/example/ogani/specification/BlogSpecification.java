package com.example.ogani.specification;

import com.example.ogani.entity.Blog;
import com.example.ogani.entity.Tag;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class BlogSpecification {
    public static Specification<Blog> getBlogs(String search, String tag) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchPattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), searchPattern)
                        )
                );
            }

            if (tag != null && !tag.isEmpty()) {
                Join<Blog, Tag> tags = root.join("tags");
                predicates.add(criteriaBuilder.equal(tags.get("slug"), tag));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

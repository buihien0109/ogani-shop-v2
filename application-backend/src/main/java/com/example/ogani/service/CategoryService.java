package com.example.ogani.service;

import com.example.ogani.entity.Category;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertParentCategory;
import com.example.ogani.model.request.UpsertSubCategory;
import com.example.ogani.repository.CategoryRepository;
import com.example.ogani.repository.ProductRepository;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final Slugify slugify;
    private final ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Order.desc("parent.id"), Sort.Order.desc("id")));
    }

    public Category createParentCategory(UpsertParentCategory request) {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Danh mục đã tồn tại");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .build();
        return categoryRepository.save(category);
    }

    public Category createSubCategory(UpsertSubCategory request) {
        Category parentCategory = categoryRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category với id " + request.getParentId()));

        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Danh mục đã tồn tại");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .parent(parentCategory)
                .build();
        return categoryRepository.save(category);
    }

    public Category updateParentCategory(Integer id, UpsertParentCategory request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + id));

        // Kiểm tra tên thể loại đã tồn tại hay chưa. Nếu đã tồn tại và không phải là thể loại cần update thì throw exception
        if (categoryRepository.findByName(request.getName()).isPresent() && !category.getName().equals(request.getName())) {
            throw new BadRequestException("Danh mục đã tồn tại");
        }

        category.setName(request.getName());
        category.setSlug(slugify.slugify(request.getName()));

        return categoryRepository.save(category);
    }

    public Category updateSubCategory(Integer id, UpsertSubCategory request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + id));

        Category parentCategory = categoryRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy  danh mục với id " + request.getParentId()));

        if (categoryRepository.findByName(request.getName()).isPresent() && !category.getName().equals(request.getName())) {
            throw new BadRequestException("Danh mục đã tồn tại");
        }
        category.setName(request.getName());
        category.setSlug(slugify.slugify(request.getName()));
        category.setParent(parentCategory);

        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id " + id));

        if (category.getParent() != null) {
            long count = productRepository.countByCategory_Id(category.getId());
            if (count > 0) {
                throw new BadRequestException("Không thể xoá danh mục này vì có " + count + " đang áp dụng");
            } else {
                categoryRepository.delete(category);
            }
        } else {
            List<Category> subCategories = category.getSubCategories();
            for (Category subCategory : subCategories) {
                long count = productRepository.countByCategory_Id(subCategory.getId());
                if (count > 0) {
                    throw new BadRequestException("Không thể xoá danh mục này vì có " + count + " đang áp dụng");
                }
            }
            categoryRepository.delete(category);
        }
    }
}

package com.example.ogani.service;

import com.example.ogani.entity.Blog;
import com.example.ogani.entity.Tag;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.TagDto;
import com.example.ogani.model.mapper.TagMapper;
import com.example.ogani.model.request.UpsertTagRequest;
import com.example.ogani.repository.BlogRepository;
import com.example.ogani.repository.TagRepository;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final BlogRepository blogRepository;
    private final Slugify slugify;
    private final TagMapper tagMapper;

    public List<TagDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return tags.stream()
                .map(tagMapper::toTagDto)
                .toList();
    }

    public List<Tag> getAllTagsByAdmin() {
        return tagRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public TagDto getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag có slug = " + slug));
        return tagMapper.toTagDto(tag);
    }

    public Tag getTagById(Integer id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag có id = " + id));
    }

    public Tag saveTag(UpsertTagRequest request) {
        if (tagRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Tag đã tồn tại");
        }

        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .build();
        tagRepository.save(tag);
        return tag;
    }

    public Tag updateTag(Integer id, UpsertTagRequest request) {
        Tag existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag có id = " + id));

        // Kiểm tra tên thể loại đã tồn tại hay chưa. Nếu đã tồn tại và không phải là thể loại cần update thì throw exception
        if (tagRepository.findByName(request.getName()).isPresent() && !Objects.equals(existingTag.getName(), request.getName())) {
            throw new BadRequestException("Tag đã tồn tại");
        }

        existingTag.setName(request.getName());
        existingTag.setSlug(slugify.slugify(request.getName()));
        return tagRepository.save(existingTag);
    }

    public void deleteTag(Integer id) {
        Tag existingTag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag có id = " + id));

        // Đếm số phim có thể loại này
        long count = blogRepository.countByTags_Id(existingTag.getId());
        if (count > 0) {
            throw new BadRequestException("Không thể xóa. Vì có " + count + " bài viết thuộc tag này");
        }

        tagRepository.deleteById(id);
    }

    public List<Blog> getAllBlogsByTagId(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tag có id = " + id));

        return tag.getBlogs().stream()
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .toList();
    }
}

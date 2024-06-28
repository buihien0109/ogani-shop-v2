package com.example.ogani.service;

import com.example.ogani.entity.Blog;
import com.example.ogani.entity.Tag;
import com.example.ogani.entity.User;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.BlogDetailsDto;
import com.example.ogani.model.dto.BlogDto;
import com.example.ogani.model.mapper.BlogMapper;
import com.example.ogani.model.request.UpsertBlogRequest;
import com.example.ogani.repository.BlogRepository;
import com.example.ogani.repository.TagRepository;
import com.example.ogani.security.SecurityUtils;
import com.example.ogani.specification.BlogSpecification;
import com.example.ogani.utils.StringUtils;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final Slugify slugify;
    private final TagRepository tagRepository;
    private final BlogMapper blogMapper;

    public Page<BlogDto> getAllBlogs(Integer page, Integer limit, String search, String tag) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Specification<Blog> spec = BlogSpecification.getBlogs(search, tag);

        Page<Blog> blogPage = blogRepository.findAll(spec, pageable);
        return blogPage.map(blogMapper::toBlogDto);
    }

    public BlogDetailsDto getBlogDetails(Integer id, String slug) {
        Blog blog = blogRepository.findByIdAndSlugAndStatus(id, slug, true)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
        return blogMapper.toBlogDetailsDto(blog);
    }

    public List<BlogDto> getLatestBlogs(Integer limit) {
        return blogRepository.findAllBlogs(true, PageRequest.of(0, limit)).getContent();
    }

    public List<BlogDto> getRecommendBlogs(Integer id, Integer limit) {
        return blogRepository.findRecommendBlogs(id, true, PageRequest.of(0, limit)).getContent();
    }

    public List<Blog> getAllBlogsByAdmin() {
        return blogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<Blog> getAllOwnBlogs() {
        User user = SecurityUtils.getCurrentUserLogin();
        return blogRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Blog createBlog(UpsertBlogRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        List<Tag> tags = tagRepository.findAllById(request.getTagIds());
        Blog blog = Blog.builder()
                .title(request.getTitle())
                .slug(slugify.slugify(request.getTitle()))
                .content(request.getContent())
                .description(request.getDescription())
                .thumbnail(StringUtils.generateLinkImage(request.getTitle()))
                .status(request.getStatus())
                .tags(tags)
                .user(user)
                .build();
        return blogRepository.save(blog);
    }

    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
    }

    @Transactional
    public Blog updateBlog(Integer id, UpsertBlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
        List<Tag> tags = tagRepository.findAllById(request.getTagIds());

        blog.setTitle(request.getTitle());
        blog.setSlug(slugify.slugify(request.getTitle()));
        blog.setDescription(request.getDescription());
        blog.setContent(request.getContent());
        blog.setStatus(request.getStatus());
        blog.setThumbnail(request.getThumbnail());
        blog.setTags(tags);
        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Integer id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
        blogRepository.delete(blog);
    }
}

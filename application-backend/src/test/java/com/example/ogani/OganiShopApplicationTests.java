package com.example.ogani;

import com.example.ogani.constant.ConstantValue;
import com.example.ogani.entity.*;
import com.example.ogani.model.enums.ReviewStatus;
import com.example.ogani.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@SpringBootTest
class OganiShopApplicationTests {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BlogRepository blogRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    void save_images() {
        loadImagesFromFolder(ConstantValue.UPLOAD_IMAGE_DIR);
    }

    public void loadImagesFromFolder(String folderPath) {
        File folder = new File(folderPath);
        if (!folder.exists() || !folder.isDirectory()) {
            throw new IllegalArgumentException("Invalid folder path");
        }

        File[] files = folder.listFiles();
        if (files == null) {
            throw new IllegalArgumentException("No files found in the folder");
        }

        User user = userRepository.findById(1).orElseThrow(() -> new IllegalArgumentException("User not found"));

        for (File file : files) {
            if (file.isFile()) {
                try {
                    Image image = new Image();
                    image.setId(file.getName());
                    image.setType("image/png");
                    image.setSize((double) Files.size(file.toPath()));
                    image.setUser(user);
                    image.setCreatedAt(LocalDateTime.now());

                    imageRepository.save(image);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Test
    void random_date_products() {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            product.setCreatedAt(randomDate);
            product.setUpdatedAt(randomDate);

            if(product.getPublished()) {
                product.setPublishedAt(randomDate);
            } else {
                product.setPublishedAt(null);
            }
            productRepository.save(product);
        }
    }

    @Test
    void random_date_blogs() {
        List<Blog> blogs = blogRepository.findAll();

        for (Blog blog : blogs) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            blog.setCreatedAt(randomDate);
            blog.setUpdatedAt(randomDate);

            if(blog.getStatus()) {
                blog.setPublishedAt(randomDate);
            } else {
                blog.setPublishedAt(null);
            }
            blogRepository.save(blog);
        }
    }

    @Test
    void random_date_users() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            user.setCreatedAt(randomDate);
            user.setUpdatedAt(randomDate);
            userRepository.save(user);
        }
    }

    @Test
    void random_date_images() {
        List<Image> images = imageRepository.findAll();

        for (Image image : images) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            image.setCreatedAt(randomDate);
            imageRepository.save(image);
        }
    }

    @Test
    void random_date_transactions() {
        List<Transaction> transactions = transactionRepository.findAll();

        for (Transaction transaction : transactions) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            transaction.setCreatedAt(randomDate);
            transaction.setUpdatedAt(randomDate);
            transactionRepository.save(transaction);
        }
    }

    @Test
    void random_date_reviews() {
        List<Review> reviews = reviewRepository.findAll();

        for (Review review : reviews) {
            LocalDateTime startDate = LocalDateTime.of(2024, 1, 1, 0, 0, 0);
            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime randomDate = randomDateTime(startDate, endDate);
            review.setCreatedAt(randomDate);
            review.setUpdatedAt(randomDate);
            reviewRepository.save(review);
        }
    }

    @Test
    void update_rating_avg_products() {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            List<Review> reviews = reviewRepository.findByProduct_IdAndStatus(product.getId(), ReviewStatus.ACCEPTED);
            double ratingAvg = 0;
            for (Review review : reviews) {
                ratingAvg += review.getRating();
            }
            if(!reviews.isEmpty()) {
                ratingAvg /= reviews.size();

                // Làm tròn 1 chữ số thập phân
                ratingAvg = Math.round(ratingAvg * 10) / 10.0;
            }
            product.setRating(ratingAvg);
            productRepository.save(product);
        }
    }

    public static LocalDateTime randomDateTime(LocalDateTime startDate, LocalDateTime endDate) {
        // Convert the start and end dates to epoch seconds
        long startEpochSecond = startDate.toEpochSecond(ZoneOffset.UTC);
        long endEpochSecond = endDate.toEpochSecond(ZoneOffset.UTC);

        // Generate a random epoch second value between the start and end dates
        long randomEpochSecond = ThreadLocalRandom.current().nextLong(startEpochSecond, endEpochSecond);

        // Convert the random epoch second value back to LocalDateTime
        return LocalDateTime.ofEpochSecond(randomEpochSecond, 0, ZoneOffset.UTC);
    }
}

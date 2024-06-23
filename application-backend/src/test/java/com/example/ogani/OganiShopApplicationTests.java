package com.example.ogani;

import com.example.ogani.constant.ConstantValue;
import com.example.ogani.entity.Image;
import com.example.ogani.entity.User;
import com.example.ogani.repository.ImageRepository;
import com.example.ogani.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;

@SpringBootTest
class OganiShopApplicationTests {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageRepository imageRepository;

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
}

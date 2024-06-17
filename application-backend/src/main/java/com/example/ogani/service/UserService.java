package com.example.ogani.service;

import com.example.ogani.constant.ConstantValue;
import com.example.ogani.entity.Image;
import com.example.ogani.entity.Role;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.dto.UserDto;
import com.example.ogani.model.mapper.UserMapper;
import com.example.ogani.model.request.CreateUserRequest;
import com.example.ogani.model.request.UpdatePasswordRequest;
import com.example.ogani.model.request.UpdateProfileUserRequest;
import com.example.ogani.model.request.UpdateUserRequest;
import com.example.ogani.model.response.ImageResponse;
import com.example.ogani.repository.ImageRepository;
import com.example.ogani.repository.RoleRepository;
import com.example.ogani.repository.UserRepository;
import com.example.ogani.security.SecurityUtils;
import com.example.ogani.utils.FileUtils;
import com.example.ogani.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageRepository imageRepository;
    private final ImageService imageService;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    public UserDto getUserProfile() {
        User user = SecurityUtils.getCurrentUserLogin();
        return userMapper.toUserDto(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll(Sort.by("createdAt").descending());
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id = " + id));
    }

    public User createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email đã tồn tại");
        }

        List<Role> roles = roleRepository.findAllById(request.getRoleIds());
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatar(StringUtils.generateLinkImage(request.getName()))
                .roles(new HashSet<>(roles))
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    public User updateUser(Integer id, UpdateUserRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id = " + id));

        List<Role> roles = roleRepository.findAllById(request.getRoleIds());
        existingUser.setName(request.getName());
        existingUser.setPhone(request.getPhone());
        existingUser.setRoles(new HashSet<>(roles));
        existingUser.setAvatar(request.getAvatar());
        existingUser.setEnabled(request.getEnabled());
        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Integer id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id = " + id));

        // delete all images of user in database and file server
        List<Image> images = imageRepository.findByUser_Id(id);
        images.forEach(image -> {
            imageService.deleteImage(image.getId());
            imageRepository.delete(image);
        });

        userRepository.delete(existingUser);
    }

    public String resetPassword(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user có id = " + id));

        user.setPassword(passwordEncoder.encode(ConstantValue.PASSWORD_DEFAULT));
        userRepository.save(user);
        return ConstantValue.PASSWORD_DEFAULT;
    }

    public ImageResponse updateAvatar(MultipartFile file) {
        User user = SecurityUtils.getCurrentUserLogin();

        FileUtils.deleteFileByURL(ConstantValue.UPLOAD_IMAGE_DIR, user.getAvatar());

        ImageResponse imageResponse = imageService.uploadImage(file);
        user.setAvatar(imageResponse.getUrl());
        userRepository.save(user);
        return imageResponse;
    }

    public void updateProfile(UpdateProfileUserRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        userRepository.save(user);
    }

    public void updatePassword(UpdatePasswordRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu mới và xác nhận mật khẩu không khớp");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public List<User> getAllUsersByEnabled(Boolean enabled) {
        return userRepository.findByEnabled(enabled);
    }
}

package com.example.ogani.service;

import com.example.ogani.entity.User;
import com.example.ogani.entity.UserAddress;
import com.example.ogani.repository.UserAddressRepository;
import com.example.ogani.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAddressService {
    private final UserAddressRepository userAddressRepository;

    public List<UserAddress> getAddressesByUser(Integer userId) {
        if (userId == null) {
            User user = SecurityUtils.getCurrentUserLogin();
            return userAddressRepository.findByUser_Id(user.getId());
        } else {
            return userAddressRepository.findByUser_Id(userId);
        }
    }
}

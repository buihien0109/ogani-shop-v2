package com.example.ogani.service;

import com.example.ogani.entity.User;
import com.example.ogani.entity.UserAddress;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.request.UpsertUserAddressRequest;
import com.example.ogani.model.response.AddressResponse;
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
    private final AddressService addressService;

    public List<UserAddress> getAddressesByUser(Integer userId) {
        if (userId == null) {
            User user = SecurityUtils.getCurrentUserLogin();
            return userAddressRepository.findByUser_Id(user.getId());
        } else {
            return userAddressRepository.findByUser_Id(userId);
        }
    }

    public UserAddress createUserAddress(UpsertUserAddressRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();
        if (request.getIsDefault()) {
            List<UserAddress> addressList = userAddressRepository.findByUser_Id(user.getId());
            addressList.forEach(address -> address.setIsDefault(false));
            userAddressRepository.saveAll(addressList);
        }

        AddressResponse addressResponse = addressService.getAddress(request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());
        UserAddress userAddress = UserAddress.builder()
                .user(user)
                .province(addressResponse.getProvince())
                .district(addressResponse.getDistrict())
                .ward(addressResponse.getWard())
                .detail(request.getDetail())
                .isDefault(request.getIsDefault())
                .build();

        return userAddressRepository.save(userAddress);
    }

    public UserAddress updateUserAddress(Integer id, UpsertUserAddressRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();
        UserAddress userAddress = userAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ của người dùng"));

        if (!userAddress.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Không thể cập nhật địa chỉ của người dùng khác");
        }

        if (request.getIsDefault()) {
            List<UserAddress> addressList = userAddressRepository.findByUser_Id(user.getId());
            addressList.forEach(address -> address.setIsDefault(false));
            userAddressRepository.saveAll(addressList);
        }

        AddressResponse addressResponse = addressService.getAddress(request.getProvinceCode(), request.getDistrictCode(), request.getWardCode());

        userAddress.setProvince(addressResponse.getProvince());
        userAddress.setDistrict(addressResponse.getDistrict());
        userAddress.setWard(addressResponse.getWard());
        userAddress.setDetail(request.getDetail());
        userAddress.setIsDefault(request.getIsDefault());
        return userAddressRepository.save(userAddress);
    }

    public void deleteUserAddress(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();
        UserAddress userAddress = userAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ của người dùng"));

        if (!userAddress.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Không thể xóa địa chỉ của người dùng khác");
        }

        userAddressRepository.deleteById(id);
    }

    public UserAddress setDefaultUserAddress(Integer id) {
        User user = SecurityUtils.getCurrentUserLogin();
        UserAddress userAddress = userAddressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ của người dùng"));

        if (!userAddress.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Không thể cập nhật địa chỉ của người dùng khác");
        }

        List<UserAddress> addressList = userAddressRepository.findByUser_Id(user.getId());
        addressList.forEach(address -> address.setIsDefault(false));
        userAddressRepository.saveAll(addressList);

        userAddress.setIsDefault(true);
        return userAddressRepository.save(userAddress);
    }
}

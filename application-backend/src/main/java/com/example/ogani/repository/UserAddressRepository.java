package com.example.ogani.repository;

import com.example.ogani.entity.UserAddress;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
    List<UserAddress> findByUser_Id(Integer id);

    List<UserAddress> findByUser_IdOrderByIsDefaultDesc(Integer id);
}
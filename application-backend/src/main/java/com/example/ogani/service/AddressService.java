package com.example.ogani.service;

import com.example.ogani.entity.District;
import com.example.ogani.entity.Province;
import com.example.ogani.entity.Ward;
import com.example.ogani.exception.ResourceNotFoundException;
import com.example.ogani.model.response.AddressResponse;
import com.example.ogani.repository.DistrictRepository;
import com.example.ogani.repository.ProvinceRepository;
import com.example.ogani.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressService {
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    public AddressResponse getAddress(Optional<String> provinceCode, Optional<String> districtCode, Optional<String> wardCode) {
        AddressResponse addressResponse = new AddressResponse();
        if (provinceCode.isPresent()) {
            Province province = provinceRepository.findByCode(provinceCode.get())
                    .orElseThrow(() -> new ResourceNotFoundException("Not found province with code = " + provinceCode.get()));
            addressResponse.setProvince(province);
        }

        if (districtCode.isPresent()) {
            District district = districtRepository.findByCode(districtCode.get())
                    .orElseThrow(() -> new ResourceNotFoundException("Not found district with code = " + districtCode.get()));
            addressResponse.setDistrict(district);
        }

        if (wardCode.isPresent()) {
            Ward ward = wardRepository.findByCode(wardCode.get())
                    .orElseThrow(() -> new ResourceNotFoundException("Not found ward with code = " + wardCode.get()));
            addressResponse.setWard(ward);
        }

        return addressResponse;
    }

    public List<Province> getProvinces() {
        return provinceRepository.findAll();
    }

    public List<District> getDistricts() {
        return districtRepository.findAll();
    }

    public List<Ward> getWards() {
        return wardRepository.findAll();
    }

    public Province getProvinceByCode(String code) {
        return provinceRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Not found province with code = " + code));
    }

    public List<District> getDistricts(Optional<String> provinceCode) {
        if (provinceCode.isEmpty()) {
            return districtRepository.findAll();
        }

        Province province = provinceRepository.findById(provinceCode.get())
                .orElseThrow(() -> new ResourceNotFoundException("Not found province with code = " + provinceCode));

        return districtRepository.findByProvince_Code(provinceCode.get());
    }

    public District getDistrictByCode(String code) {
        return districtRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Not found district with code = " + code));
    }

    public List<Ward> getWards(Optional<String> districtCode) {
        if (districtCode.isEmpty()) {
            return wardRepository.findAll();
        }

        District district = districtRepository.findById(districtCode.get())
                .orElseThrow(() -> new ResourceNotFoundException("Not found district with code = " + districtCode));

        return wardRepository.findByDistrict_Code(districtCode.get());
    }
}

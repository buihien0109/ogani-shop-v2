import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetDistrictsQuery, useGetWardsQuery } from '../../../../../app/apis/address.api';

// Schema validation với yup
const schema = yup.object().shape({
    province: yup.object().required('Tỉnh/thành phố không được để trống'),
    district: yup.object().required('Quận/huyện không được để trống'),
    ward: yup.object().required('Xã/phường không được để trống'),
    address: yup.string().required('Địa chỉ giao hàng không được để trống')
});

function ModalUpdateAddress({ address, show, onHide }) {
    const { provinces } = useSelector(state => state.address);
    const [provinceCode, setProvinceCode] = useState(address.provinceCode);
    const [districtCode, setDistrictCode] = useState(address.districtCode);

    const { data: districts } = useGetDistrictsQuery(provinceCode, { skip: !provinceCode });
    const { data: wards } = useGetWardsQuery(districtCode, { skip: !districtCode });

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            province: provinces.find(province => province.code === address.provinceCode) || null,
            district: districts ? districts.find(district => district.code === address.districtCode) : null,
            ward: wards ? wards.find(ward => ward.code === address.wardCode) : null,
            address: address.detail || ''
        }
    });

    useEffect(() => {
        if (provinceCode) {
            setValue('district', null);
            setValue('ward', null);
        }
    }, [provinceCode, setValue]);

    useEffect(() => {
        if (districtCode) {
            setValue('ward', null);
        }
    }, [districtCode, setValue]);

    const onSubmit = data => {
        console.log(data);
        // Xử lý logic khi form hợp lệ và được submit
    };

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật địa chỉ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="form-address" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Controller
                                name="province"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Chọn tỉnh/thành phố"
                                        options={
                                            provinces && provinces.map(province => ({
                                                value: province.code,
                                                label: province.name
                                            }))
                                        }
                                        defaultValue={
                                            provinces.find(province => province.code === address.provinceCode) || null
                                        }
                                        onChange={(selectedOption) => {
                                            setProvinceCode(selectedOption.value);
                                            field.onChange(selectedOption);
                                            setDistrictCode(null);
                                        }}
                                        isDisabled={address.isDefault}
                                    />
                                )}
                            />
                            {errors.province && <p className="text-danger">{errors.province.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="district"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Chọn quận/huyện"
                                        options={
                                            districts && districts.map(district => ({
                                                value: district.code,
                                                label: district.name
                                            }))
                                        }
                                        defaultValue={
                                            districts ? districts.find(district => district.code === address.districtCode) : null
                                        }
                                        isDisabled={!provinceCode || address.isDefault}
                                        onChange={(selectedOption) => {
                                            setDistrictCode(selectedOption.value);
                                            field.onChange(selectedOption);
                                        }}
                                    />
                                )}
                            />
                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="ward"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Chọn xã/phường"
                                        options={
                                            wards && wards.map(ward => ({
                                                value: ward.code,
                                                label: ward.name
                                            }))
                                        }
                                        defaultValue={
                                            wards ? wards.find(ward => ward.code === address.wardCode) : null
                                        }
                                        isDisabled={!districtCode || address.isDefault}
                                    />
                                )}
                            />
                            {errors.ward && <p className="text-danger">{errors.ward.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Địa chỉ giao hàng"
                                        className="form-control"
                                        defaultValue={address.detail}
                                        disabled={address.isDefault}
                                    />
                                )}
                            />
                            {errors.address && <p className="text-danger">{errors.address.message}</p>}
                        </div>
                        <div className="mb-4">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    id="set-address-default"
                                    checked={address.isDefault}
                                    disabled
                                />
                                <label
                                    htmlFor="set-address-default"
                                    className="mb-0 ms-1 text-muted">
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="border-0 primary-btn bg-secondary me-2" onClick={onHide}>Đóng</button>
                            <button type="submit" className="border-0 primary-btn btn-handle-address">Cập nhật</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalUpdateAddress;

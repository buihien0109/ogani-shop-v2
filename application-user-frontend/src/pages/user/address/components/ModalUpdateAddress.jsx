import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useGetDistrictsQuery, useGetWardsQuery } from '../../../../app/apis/address.api';
import { useUpdateUserAddressMutation } from '../../../../app/apis/userAddress.api';

const schema = yup.object().shape({
    province: yup.object().required('Tỉnh/thành phố không được để trống'),
    district: yup.object().required('Quận/huyện không được để trống'),
    ward: yup.object().required('Xã/phường không được để trống'),
    address: yup.string().required('Địa chỉ giao hàng không được để trống')
});

function ModalUpdateAddress({ address, show, onHide }) {
    const { provinces } = useSelector(state => state.address);
    const [provinceCode, setProvinceCode] = useState(address.province.code);
    const [districtCode, setDistrictCode] = useState(address.district.code);

    const { data: districts } = useGetDistrictsQuery(provinceCode, { skip: !provinceCode });
    const { data: wards } = useGetWardsQuery(districtCode, { skip: !districtCode });
    const [updateUserAddress, { isLoading: isLoadingUpdateAddress }] = useUpdateUserAddressMutation()

    const { register, control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            province: null,
            district: null,
            ward: null,
            address: '',
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


    useEffect(() => {
        if (address) {
            setValue('province', { value: address.province.code, label: address.province.name });
            setValue('district', { value: address.district.code, label: address.district.name });
            setValue('ward', { value: address.ward.code, label: address.ward.name });
            setValue('address', address.detail);
        }
    }, [address]);

    const onSubmit = values => {
        const data = {
            provinceCode: values.province.value,
            districtCode: values.district.value,
            wardCode: values.ward.value,
            detail: values.address,
            isDefault: address.isDefault ? address.isDefault : values.isDefault
        }

        updateUserAddress({ id: address.id, ...data })
            .unwrap()
            .then(() => {
                toast.success("Cập nhật địa chỉ thành công");
                onHide();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
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
                                        className={errors.province ? 'is-invalid' : ''}
                                        {...field}
                                        placeholder="Chọn tỉnh/thành phố"
                                        options={
                                            provinces && provinces.map(province => ({
                                                value: province.code,
                                                label: province.name
                                            }))
                                        }
                                        onChange={(selectedOption) => {
                                            setProvinceCode(selectedOption.value);
                                            field.onChange(selectedOption);
                                            setDistrictCode(null);
                                        }}
                                    />
                                )}
                            />
                            {errors.province && <span className="error invalid-feedback">{errors.province.message}</span>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="district"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        className={errors.district ? 'is-invalid' : ''}
                                        {...field}
                                        placeholder="Chọn quận/huyện"
                                        options={
                                            districts && districts.map(district => ({
                                                value: district.code,
                                                label: district.name
                                            }))
                                        }
                                        isDisabled={!provinceCode}
                                        onChange={(selectedOption) => {
                                            setDistrictCode(selectedOption.value);
                                            field.onChange(selectedOption);
                                        }}
                                    />
                                )}
                            />
                            {errors.district && <span className="error invalid-feedback">{errors.district.message}</span>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="ward"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        className={errors.ward ? 'is-invalid' : ''}
                                        {...field}
                                        placeholder="Chọn xã/phường"
                                        options={
                                            wards && wards.map(ward => ({
                                                value: ward.code,
                                                label: ward.name
                                            }))
                                        }
                                        isDisabled={!districtCode}
                                    />
                                )}
                            />
                            {errors.ward && <p className="error invalid-feedback">{errors.ward.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        {...field}
                                        type="text"
                                        placeholder="Địa chỉ giao hàng"
                                    />
                                )}
                            />
                            {errors.address && <span className="error invalid-feedback">{errors.address.message}</span>}
                        </div>
                        {!address.isDefault && (
                            <div className="mb-4">
                                <div className="d-flex align-items-center">
                                    <div className="form-check form-switch">
                                        <input
                                            {...register("isDefault")}
                                            className="form-check-input"
                                            type="checkbox"
                                            id="set-address-default"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="set-address-default"
                                        >Đặt làm địa chỉ mặc định</label>
                                    </div>
                                </div>
                            </div>
                        )}
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

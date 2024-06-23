import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useChangePasswordMutation } from '../../../../app/apis/user.api';

const schema = yup.object().shape({
    oldPassword: yup.string().required('Mật khẩu cũ không được để trống'),
    newPassword: yup.string().required('Mật khẩu mới không được để trống'),
    confirmPassword: yup.string()
        .required('Nhập lại mật khẩu mới không được để trống')
        .oneOf([yup.ref('newPassword'), null], 'Nhập lại mật khẩu mới không khớp')
});

function UpdatePassword() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const [changePassword] = useChangePasswordMutation();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const onSubmit = (data) => {
        changePassword(data)
            .unwrap()
            .then(() => {
                toast.success('Đổi mật khẩu thành công');
                reset();
            })
            .catch((error) => {
                toast.error(error.data.message)
            })
    };

    return (
        <>
            <div className="customer-info pt-5" style={{ borderTop: "10px solid #f2f2f2" }}>
                <form id="form-update-password" onSubmit={handleSubmit(onSubmit)}>
                    <h4 className="mb-4">Đổi mật khẩu</h4>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Mật khẩu cũ</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0">
                                <div className="login-form-input form-group mb-0">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        className={`input-full form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
                                        placeholder="Nhập mật khẩu cũ"
                                        {...register('oldPassword')}
                                    />
                                    <span className="icon-toggle-password" onClick={toggleShowOldPassword}>
                                        <i className={`fa-regular ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                    {errors.oldPassword && <span className="error invalid-feedback">{errors.oldPassword.message}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Mật khẩu mới</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0">
                                <div className="login-form-input form-group mb-0">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        className={`input-full form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                        placeholder="Nhập mật khẩu mới"
                                        {...register('newPassword')}
                                    />
                                    <span className="icon-toggle-password" onClick={toggleShowNewPassword}>
                                        <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                    {errors.newPassword && <span className="error invalid-feedback">{errors.newPassword.message}</span>}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Nhập lại mật khẩu mới</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0">
                                <div className="login-form-input form-group mb-0">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`input-full form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        placeholder="Nhập lại mật khẩu mới"
                                        {...register('confirmPassword')}
                                    />
                                    <span className="icon-toggle-password" onClick={toggleShowConfirmPassword}>
                                        <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                    {errors.confirmPassword && <span className="error invalid-feedback">{errors.confirmPassword.message}</span>}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="w-100 d-flex justify-content-end">
                                <button type="submit" className="border-0 primary-btn" id="btn-update-password">Cập nhật</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>

    );
}

export default UpdatePassword;

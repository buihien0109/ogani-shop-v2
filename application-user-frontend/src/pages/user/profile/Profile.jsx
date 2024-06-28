import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useGetUserProfileQuery, useUpdateAvatarMutation, useUpdateProfileMutation } from '../../../app/apis/user.api';
import { updateAuth } from '../../../app/slices/auth.slice';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';

const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống'),
    phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .matches(
            /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
            'Số điện thoại không đúng định dạng'
        ),
});

function Profile() {
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const { data: user, isLoading, isError } = useGetUserProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [updateAvatar] = useUpdateAvatarMutation();
    const [avatar, setAvatar] = useState("");


    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('phone', user.phone);
            setAvatar(user.avatar);
        }
    }, [user, setValue]);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    const onSubmit = (data) => {
        updateProfile(data)
            .unwrap()
            .then(() => {
                toast.success('Cập nhật thông tin cá nhân thành công');
                dispatch(updateAuth(data));
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.response.data.message)
            })
    };

    const handleUploadAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        updateAvatar(formData)
            .unwrap()
            .then((res) => {
                toast.success("Cập nhật ảnh đại diện thành công");
                dispatch(updateAuth({ avatar: res.url }))
                setAvatar(res.url);
            })
            .catch((error) => {
                toast.error(error.data.message)
            });
    }

    return (
        <>
            <Helmet>
                <title>Thông tin cá nhân</title>
            </Helmet>


            <div className="customer-info">
                <h4 className="mb-4">Thông tin tài khoản</h4>
                <div className="row mb-4">
                    <div className="col-lg-2">
                        <div className="d-flex align-items-center h-100">
                            <p className="my-0">Avatar</p>
                        </div>
                    </div>
                    <div className="col-lg-10">
                        <div className="checkout__input mb-0">
                            <div className="user-avatar-container d-flex align-items-center">
                                <img
                                    id="avatar-preview"
                                    src={avatar}
                                    alt={user.name}
                                />
                                <label htmlFor="avatar">Đổi Avatar</label>
                                <input
                                    type="file"
                                    id="avatar"
                                    className="d-none"
                                    onChange={handleUploadAvatar}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <form id="form-update-profile" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Họ tên</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0 form-group">
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Nhập họ tên"
                                    {...register('name')}
                                />
                                {errors.name && <span className="error invalid-feedback">{errors.name.message}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Số điện thoại</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0 form-group">
                                <input
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="Nhập số điện thoại"
                                    {...register('phone')}
                                />
                                {errors.phone && <span className="error invalid-feedback">{errors.phone.message}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-lg-2">
                            <div className="d-flex align-items-center h-100">
                                <p className="my-0">Email</p>
                            </div>
                        </div>
                        <div className="col-lg-10">
                            <div className="checkout__input mb-0 form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={user.email}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="w-100 d-flex justify-content-end">
                                <button type="submit" className="border-0 primary-btn" id="btn-update-profile">Cập nhật</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Profile;

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useLoginMutation } from '../../../app/apis/auth.api';
import { IconLoading } from '../../../components/icon/Icon';

const schema = yup.object().shape({
    email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [login, { isLoading }] = useLoginMutation();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const onSubmit = data => {
        login(data).unwrap()
            .then(() => {
                toast.success('Đăng nhập thành công');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
    };

    return (
        <>
            <Helmet>
                <title>Đăng nhập</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>Đăng nhập</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="login-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
                            <div className="login-container">
                                <div id="custom-login-form">
                                    <form id="customer-login-form" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="login-form-container">
                                            <div className="login-text">
                                                <h3 className="mb-2">Đăng nhập</h3>
                                                <p>Vui lòng điền thông tin vào form bên dưới.</p>
                                            </div>
                                            <div className="login-form">
                                                <div className="login-form-input form-group mb-3">
                                                    <input
                                                        type="text"
                                                        className={`input-full form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        id="email"
                                                        name="email"
                                                        placeholder="Email"
                                                        {...register('email')}
                                                    />
                                                    {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                                                </div>

                                                <div className="login-form-input form-group mb-3">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className={`input-full form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        id="password"
                                                        name="password"
                                                        placeholder="Mật khẩu"
                                                        {...register('password')}
                                                    />
                                                    <span
                                                        className="icon-toggle-password"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </span>
                                                    {errors.password && <span className="error invalid-feedback">{errors.password.message}</span>}
                                                </div>

                                                <div className="login-toggle-btn">
                                                    <div className="form-action-button">
                                                        <Button
                                                            type="submit"
                                                            className="btn-sign-in d-flex align-items-center justify-content-center"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? <IconLoading /> : null}
                                                            Đăng nhập
                                                        </Button>
                                                        <Link to={"/quen-mat-khau"} id="recover-password">Quên mật khẩu?</Link>
                                                    </div>
                                                    <div className="account-optional-action">
                                                        <Link to={"/dang-ky"} id="customer_register_link">Tạo tài khoản</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
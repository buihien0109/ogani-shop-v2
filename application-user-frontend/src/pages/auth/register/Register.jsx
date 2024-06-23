import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useRegisterAccountMutation } from '../../../app/apis/auth.api';
import { IconLoading } from '../../../components/icon/Icon';

const schema = yup.object().shape({
  name: yup.string().required('Tên không được để trống'),
  email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp')
    .required('Mật khẩu xác nhận không được để trống'),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [registerAccount, { isLoading }] = useRegisterAccountMutation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = data => {
    registerAccount(data).unwrap()
      .then(() => {
        toast.success("Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.");
        setTimeout(() => {
          navigate('/dang-nhap');
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
        <title>Đăng ký</title>
      </Helmet>

      <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <div className="breadcrumb__option">
                  <Link to={"/"}>Trang chủ</Link>
                  <span>Đăng ký</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="register-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
              <div className="register-container">
                <div id="custom-register-form">
                  <form id="customer-register-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="register-form-container">
                      <div className="register-text">
                        <h2 className="mb-2">Đăng ký</h2>
                        <p>Vui lòng điền thông tin vào form bên dưới.</p>
                      </div>
                      <div className="register-form">
                        <div className="login-form-input form-group mb-3">
                          <input
                            type="text"
                            className={`input-full form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Tên người dùng"
                            {...register('name')} />
                          {errors.name && <span className="error invalid-feedback">{errors.name.message}</span>}
                        </div>

                        <div className="login-form-input form-group mb-3">
                          <input
                            type="text"
                            className={`input-full form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder="Email"
                            {...register('email')} />
                          {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                        </div>

                        <div className="login-form-input form-group mb-3">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`input-full form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            placeholder="Mật khẩu"
                            {...register('password')}
                          />
                          <span
                            className="icon-toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fa-regular fa-eye${showPassword ? "-slash" : ""}`}></i>
                          </span>
                          {errors.password && <span className="error invalid-feedback">{errors.password.message}</span>}
                        </div>

                        <div className="login-form-input form-group mb-3">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`input-full form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirm-password"
                            placeholder="Nhập lại mật khẩu"
                            {...register('confirmPassword')}
                          />
                          <span
                            className="icon-toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fa-regular fa-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                          </span>
                          {errors.confirmPassword && <span className="error invalid-feedback">{errors.confirmPassword.message}</span>}
                        </div>
                        <div className="register-toggle-btn">
                          <div className="form-action-button">
                            <Button
                              type="submit"
                              className="btn-sign-up d-flex align-items-center justify-content-center"
                              disabled={isLoading}
                            >
                              {isLoading ? <IconLoading /> : null}
                              Đăng ký
                            </Button>
                            <Link to={"/quen-mat-khau"} id="recover-password">Quên mật khẩu?</Link>
                          </div>
                          <div className="account-optional-action">
                            <Link to={"/dang-nhap"} id="customer_register_link">Quay lại đăng nhập</Link>
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
};

export default Register;

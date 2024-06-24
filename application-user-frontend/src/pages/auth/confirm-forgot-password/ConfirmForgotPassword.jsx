import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useChangePasswordMutation, useCheckForgotPasswordTokenQuery } from '../../../app/apis/auth.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';

const schema = yup.object().shape({
  newPassword: yup.string().required('Mật khẩu mới không được để trống'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp')
    .required('Mật khẩu xác nhận không được để trống'),
});

const ConfirmForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const {
    data,
    isLoading: isLoadingCheckForgotPasswordToken,
    isError: isErrorCheckForgotPasswordToken,
    error
  } = useCheckForgotPasswordTokenQuery(token);
  const [changePassword, { isLoading }] = useChangePasswordMutation();


  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isLoadingCheckForgotPasswordToken) {
    return <Loading />
  }

  if (isErrorCheckForgotPasswordToken) {
    return <ErrorPage />
  }

  const onSubmit = data => {
    changePassword({ ...data, token })
      .unwrap()
      .then((res) => {
        toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập');
        setTimeout(() => {
          navigate("/dang-nhap")
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  };

  return (
    <>
      <Helmet>
        <title>Đặt lại mật khẩu</title>
      </Helmet>

      <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <div className="breadcrumb__option">
                  <Link to={"/"}>Trang chủ</Link>
                  <span>Đặt lại mật khẩu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wishlist spad">
        <div className="container">
          {!data.success && (
            <div className="row">
              <h4>{data.message}</h4>
            </div>
          )}

          {data.success && (
            <div className="row">
              <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
                <div className="register-container">
                  <div id="custom-register-form">
                    <form id="customer-reset-password-form" onSubmit={handleSubmit(onSubmit)}>
                      <div className="register-form-container">
                        <div className="register-text">
                          <h2 className="mb-2">Đặt lại mật khẩu</h2>
                          <p>Vui lòng điền thông tin vào form bên dưới.</p>
                        </div>
                        <div className="register-form">
                          <div className="login-form-input form-group">
                            <input type="password" id="password" className="input-full form-control"
                              placeholder="Mật khẩu mới" autocomplete="off" name="password" />
                            <span className="icon-toggle-password"><i className="fa fa-eye"
                              aria-hidden="true"></i></span>
                          </div>
                          <div className="login-form-input form-group">
                            <input type="password" id="confirm-password" className="input-full form-control"
                              placeholder="Nhập lại mật khẩu" autocomplete="off"
                              name="confirmPassword" />
                            <span className="icon-toggle-password"><i className="fa fa-eye"
                              aria-hidden="true"></i></span>
                          </div>
                          <div className="register-toggle-btn">
                            <div className="form-action-button">
                              <button type="submit" className="btn-sign-up">Xác nhận</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ConfirmForgotPassword;

import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useForgotPasswordMutation } from '../../../app/apis/auth.api';

const schema = yup.object().shape({
  email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
});

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = data => {
    forgotPassword(data)
      .unwrap()
      .then((res) => {
        toast.success("Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message)
      });
  };

  return (
    <>
      <Helmet>
        <title>Quên mật khẩu</title>
      </Helmet>

      <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <div className="breadcrumb__option">
                  <Link to={"/"}>Trang chủ</Link>
                  <span>Quên mật khẩu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reset-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
              <div className="reset-container">
                <div id="custom-reset-form">
                  <form id="customer-reset-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="reset-form-container">
                      <div className="reset-text">
                        <h3 className="mb-2">Quên mật khẩu</h3>
                        <p>Vui lòng điền thông tin vào form bên dưới.</p>
                      </div>
                      <div className="reset-form">
                        <div className="reset-form-input form-group mb-3">
                          <input
                            type="text"
                            className={`input-full form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder="Email"
                            {...register('email')} />
                          {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                        </div>

                        <div className="reset-toggle-btn">
                          <div className="form-action-button">
                            <button type="submit" className="btn-sign-in">Xác nhận</button>
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

export default ForgotPassword;

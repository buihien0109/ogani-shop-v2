import React from 'react';
import { Link } from 'react-router-dom';
import logoFacebook from "../../../public/facebook.png";
import logo from "../../../public/logo.png";
import logoTwitter from "../../../public/twitter.png";
import logoYoutube from "../../../public/youtube.png";


function Footer() {
    return (
        <footer className="footer spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__about footer__widget">
                            <div className="footer__about__logo">
                                <a href="/"><img src={logo} alt="logo" /></a>
                            </div>
                            <ul>
                                <li>Địa chỉ: 132 Thanh Xuân, Hà Nội</li>
                                <li>Số điện thoại: 0988888888</li>
                                <li>Email: admin@ogani.com</li>
                            </ul>

                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__widget">
                            <h6>VỀ CHÚNG TÔI</h6>
                            <ul>
                                <li><a href="#">Giới thiệu</a></li>
                                <li><a href="#">Quản lý chất lượng</a></li>
                                <li><a href="#">Chính sách bảo mật</a></li>
                                <li><a href="#">Điều khoản và điều kiện giao dịch</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__widget">
                            <h6>HỖ TRỢ KHÁCH HÀNG</h6>
                            <ul>
                                <li><a href="#">Trung tâm hỗ trợ khách hàng</a></li>
                                <li><a href="#">Chính sách giao hàng</a></li>
                                <li><a href="#">Chính sách thanh toán</a></li>
                                <li><a href="#">Chính sách đổi trả</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__widget">
                            <h6>SOCIAL</h6>
                            <div className="d-flex">
                                <p className="fs-4 me-3">
                                    <Link to={"#"}>
                                        <img src={logoFacebook} alt="Logo Facebook" className="logo-social" />
                                    </Link>
                                </p>
                                <p className="fs-4 me-3">
                                    <Link to={"#"}>
                                        <img src={logoTwitter} alt="Logo Twitter" className="logo-social" />
                                    </Link>
                                </p>
                                <p className="fs-4 me-3">
                                    <Link to={"#"}>
                                        <img src={logoYoutube} alt="Logo Youtube" className="logo-social" />
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
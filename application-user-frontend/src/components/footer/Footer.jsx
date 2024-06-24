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
                                <Link to={"/"}><img src={logo} alt="logo" /></Link>
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
                                <li><Link to={"#"}>Giới thiệu</Link></li>
                                <li><Link to={"#"}>Quản lý chất lượng</Link></li>
                                <li><Link to={"#"}>Chính sách bảo mật</Link></li>
                                <li><Link to={"#"}>Điều khoản và điều kiện giao dịch</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__widget">
                            <h6>HỖ TRỢ KHÁCH HÀNG</h6>
                            <ul>
                                <li><Link to={"#"}>Trung tâm hỗ trợ khách hàng</Link></li>
                                <li><Link to={"#"}>Chính sách giao hàng</Link></li>
                                <li><Link to={"#"}>Chính sách thanh toán</Link></li>
                                <li><Link to={"#"}>Chính sách đổi trả</Link></li>
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
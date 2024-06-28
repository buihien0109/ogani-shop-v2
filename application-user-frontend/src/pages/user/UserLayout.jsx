import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import breadcrumb from "../../../public/breadcrumb.jpg";

function UserLayout() {
    const location = useLocation();
    const pathname = location.pathname;
    const menu = [
        { key: 'profile', name: 'Tài khoản', link: '/khach-hang/tai-khoan', icon: 'fa-solid fa-user' },
        { key: 'password', name: 'Mật khẩu', link: '/khach-hang/mat-khau', icon: 'fa-solid fa-key' },
        { key: 'address', name: 'Sổ địa chỉ', link: '/khach-hang/dia-chi', icon: 'fa-solid fa-location-dot' },
        { key: 'history', name: 'Lịch sử giao dịch', link: '/khach-hang/lich-su-giao-dich', icon: 'fa-solid fa-clock-rotate-left' },
    ];

    const currentMenu = menu.find(item => item.link === pathname);

    return (
        <>
            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>{currentMenu.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="history-section spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="customer-sidebar">
                                <ul className="customer-sidebar-menu">
                                    {menu.map(item => (
                                        <li key={item.key} className="menu-item">
                                            <Link to={item.link} className={`${item.link === pathname ? "active" : ""}`}>
                                                <span className="menu-item-icon"><i className={item.icon}></i></span>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserLayout
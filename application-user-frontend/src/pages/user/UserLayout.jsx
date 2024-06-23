import React from 'react'
import { Link, Outlet } from 'react-router-dom'

function UserLayout() {
    return (
        <>
            <section className="history-section spad">
                <div className="container p-4 bg-white">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="customer-sidebar">
                                <ul className="customer-sidebar-menu">
                                    <li className="menu-item">
                                        <Link to={"/khach-hang/tai-khoan"}>
                                            <span className="menu-item-icon"><i className="fa-solid fa-user"></i></span>
                                            <span>Tài khoản</span>
                                        </Link>
                                    </li>
                                    <li className="menu-item">
                                        <Link to={"/khach-hang/quan-ly-don-hang"}>
                                            <span className="menu-item-icon"><i className="fa-regular fa-file"></i></span>
                                            <span>Quản lý đơn hàng</span>
                                        </Link>
                                    </li>
                                    <li className="menu-item">
                                        <Link to={"/khach-hang/dia-chi"}>
                                            <span className="menu-item-icon"><i className="fa-solid fa-location-dot"></i></span>
                                            <span>Sổ địa chỉ</span>
                                        </Link>
                                    </li>
                                    <li className="menu-item">
                                        <Link to={"/khach-hang/lich-su-giao-dich"}>
                                            <span className="menu-item-icon"><i className="fa-solid fa-clock-rotate-left"></i></span>
                                            <span>Lịch sử giao dịch</span>
                                        </Link>
                                    </li>
                                    <li className="menu-item">
                                        <span className="logout-btn">
                                            <span className="menu-item-icon"><i className="fa-solid fa-right-from-bracket"></i></span>
                                            <span>Đăng xuất</span>
                                        </span>
                                    </li>
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
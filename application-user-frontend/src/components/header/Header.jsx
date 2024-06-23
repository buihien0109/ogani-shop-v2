import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../../../public/logo.png";
import { useLogoutApiMutation } from '../../app/apis/auth2.api';
import { logout } from '../../app/slices/auth.slice';

const organizeCategories = (apiData) => {
    // Tạo một danh sách các danh mục chính và danh mục con
    const categories = [];
    const subCategoriesMap = {};

    // Lọc các danh mục chính và danh mục con từ dữ liệu API
    apiData.forEach(item => {
        if (item.parent === null) {
            categories.push(item);
        } else {
            if (!subCategoriesMap[item.parent.id]) {
                subCategoriesMap[item.parent.id] = [];
            }
            subCategoriesMap[item.parent.id].push(item);
        }
    });

    // Sắp xếp các danh mục và danh mục con theo thứ tự createdAt tăng dần
    categories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    Object.keys(subCategoriesMap).forEach(key => {
        subCategoriesMap[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    // Tạo cấu trúc kết quả
    const result = categories.map(category => {
        return {
            category: category,
            subCategories: subCategoriesMap[category.id] || []
        };
    });

    return result;
}


function Header() {
    const dispatch = useDispatch();
    const { auth, isAuthenticated } = useSelector(state => state.auth)
    const categories = useSelector(state => state.categories)
    const [showMenu, setShowMenu] = useState(false)
    const [logoutApi, { isLoading }] = useLogoutApiMutation()

    const renderedCategories = organizeCategories(categories)

    const handleLogout = () => {
        logoutApi().unwrap()
            .then(() => {
                dispatch(logout())
                toast.success("Đăng xuất thành công")
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })

    }
    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="header__logo">
                                <Link to={"/"}><img src={logo} alt="logo" /></Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero__search mb-0 h-100 d-flex align-items-center">
                                <div className="hero__search__form">
                                    <form action="#">
                                        <button type="submit" className="site-btn">
                                            <span><i className="fa fa-search" aria-hidden="true"></i></span>
                                        </button>
                                        <input type="text" placeholder="Tìm kiếm sản phẩm" />
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="header__cart">
                                <ul>
                                    <li>
                                        <Link to={"/yeu-thich"} className="wishlist-icon">
                                            <i className="fa-solid fa-heart"></i>
                                            <span>1</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={"/gio-hang"} className="shopping-cart-icon">
                                            <i className="fa-solid fa-bag-shopping"></i>
                                            <span>3</span>
                                        </Link>
                                    </li>

                                    {!isAuthenticated && (
                                        <li>
                                            <Link to={"/dang-nhap"}><i className="fa-solid fa-user"></i></Link>
                                        </li>
                                    )}

                                    {isAuthenticated && (
                                        <li>
                                            <div className="user-avatar-container">
                                                <img
                                                    className="user-avatar"
                                                    src={auth.avatar}
                                                    alt={auth.name}
                                                    onClick={() => setShowMenu(!showMenu)}
                                                />

                                                {showMenu && (
                                                    <ul className="menu">
                                                        {auth.roles.includes("ADMIN") && (
                                                            <li className="menu-item">
                                                                <NavLink to={"/admin/dashboard"}>
                                                                    <span><i className="fa fa-user-secret" aria-hidden="true"></i></span> Trang quản trị
                                                                </NavLink>
                                                            </li>
                                                        )}
                                                        <li className="menu-item">
                                                            <NavLink to={"/khach-hang/tai-khoan"}>
                                                                <span><i className="fa-solid fa-user"></i></span> Tài khoản
                                                            </NavLink>
                                                        </li>
                                                        <li className="menu-item">
                                                            <NavLink to={"/khach-hang/quan-ly-don-hang"}>
                                                                <span><i className="fa-regular fa-file"></i></span> Quản lý đơn hàng
                                                            </NavLink>
                                                        </li>
                                                        <li className="menu-item">
                                                            <NavLink to={"/khach-hang/dia-chi"}>
                                                                <span><i className="fa-solid fa-location-dot"></i></span> Sổ địa chỉ
                                                            </NavLink>
                                                        </li>
                                                        <li className="menu-item">
                                                            <NavLink to={"/khach-hang/lich-su-giao-dich"}>
                                                                <span><i className="fa-solid fa-clock-rotate-left"></i></span> Lịch sử giao dịch
                                                            </NavLink>
                                                        </li>
                                                        <li className="menu-item">
                                                            <p className="logout-btn" onClick={handleLogout}>
                                                                <span><i className="fa-solid fa-right-from-bracket"></i></span> Đăng xuất
                                                            </p>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="hero__categories py-4">
                                <div className="hero__categories__all">
                                    <div className="hero__categories__all_btn">
                                        <i className="fa fa-bars"></i>
                                        <span>Danh mục</span>
                                    </div>
                                    <ul className="menu">
                                        {renderedCategories.map((item, index) => (
                                            <li key={index} className={`menu-item ${item.subCategories.length > 0 ? "has-sub-menu" : ""}`}>
                                                <div className="menu-item-label">
                                                    <Link to={`/danh-muc/${item.category.slug}`}>{item.category.name}</Link>
                                                    {item.subCategories.length > 0 && (
                                                        <span>
                                                            <span className="icon">
                                                                <i className="fa-solid fa-angle-right"></i>
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="sub-menu">
                                                    <ul>
                                                        {item.subCategories.map((subItem, subIndex) => (
                                                            <li key={subIndex} className="menu-item">
                                                                <Link to={`/danh-muc/${item.category.slug}?sub=${subItem.slug}`}>{subItem.name}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center justify-content-end h-100">
                                <div className="me-3 text-muted d-flex align-items-center">
                                    <span className="font-weight-bolder d-inline-block me-1">
                                        <i class="fa-solid fa-envelope"></i>
                                    </span>
                                    <span>
                                        <Link to={"/bai-viet"} className="text-muted">Tin tức Ogani</Link>
                                    </span>
                                </div>
                                <div className="text-muted d-flex align-items-center">
                                    <span className="font-weight-bolder d-inline-block me-1">
                                        <i class="fa-solid fa-headphones-simple"></i>
                                    </span>
                                    <span>
                                        <Link to={"#"} className="text-muted">Tư vấn mua hàng</Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Header
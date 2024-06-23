import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { addressApi } from "./app/services/address.service";
import NotFoundPage from "./components/error-page/NotFoundPage";
import AppLayout from "./components/layout/AppLayout";
import AuthorizeRoutes from "./components/private/AuthorizeRoutes";
import PrivateRoutes from "./components/private/PrivateRoutes";
import BannerCreate from "./pages/banner/banner-create/BannerCreate";
import BannerDetail from "./pages/banner/banner-detail/BannerDetail";
import BannerList from "./pages/banner/banner-list/BannerList";
import BannerSort from "./pages/banner/banner-sort/BannerSort";
import BlogCreate from "./pages/blog/blog-create/BlogCreate";
import BlogDetail from "./pages/blog/blog-detail/BlogDetail";
import BlogList from "./pages/blog/blog-list/BlogList";
import OwnBlogList from "./pages/blog/own-blog/OwnBlogList";
import CategoryList from "./pages/category/CategoryList";
import CouponList from "./pages/coupon/CouponList";
import Dashboard from "./pages/dashboard/dashboard/Dashboard";
import DiscountCampaignCreate from "./pages/discount-campaign/discount-campaign-create/DiscountCampaignCreate";
import DiscountCampaignDetail from "./pages/discount-campaign/discount-campaign-detail/DiscountCampaignDetail";
import DiscountCampaignList from "./pages/discount-campaign/discount-campaign-list/DiscountCampaignList";
import Login from "./pages/login/Login";
import OrderCreate from "./pages/order/order-create/OrderCreate";
import OrderDetail from "./pages/order/order-detail/OrderDetail";
import OrderList from "./pages/order/order-list/OrderList";
import PaymentVoucherCreate from "./pages/payment-voucher/payment-voucher-create/PaymentVoucherCreate";
import PaymentVoucherDetail from "./pages/payment-voucher/payment-voucher-detail/PaymentVoucherDetail";
import PaymentVoucherList from "./pages/payment-voucher/payment-voucher-list/PaymentVoucherList";
import ProductCreate from "./pages/product/product-create/ProductCreate";
import ProductDetail from "./pages/product/product-detail/ProductDetail";
import ProductList from "./pages/product/product-list/ProductList";
import Report from "./pages/report/Report";
import SupplierCreate from "./pages/supplier/supplier-create/SupplierCreate";
import SupplierDetail from "./pages/supplier/supplier-detail/SupplierDetail";
import SupplierList from "./pages/supplier/supplier-list/SupplierList";
import TagList from "./pages/tag/TagList";
import TransactionCreate from "./pages/transaction/transaction-create/TransactionCreate";
import TransactionDetail from "./pages/transaction/transaction-detail/TransactionDetail";
import TransactionList from "./pages/transaction/transaction-list/TransactionList";
import UserCreate from "./pages/user/user-create/UserCreate";
import UserDetail from "./pages/user/user-detail/UserDetail";
import UserList from "./pages/user/user-list/UserList";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addressApi.endpoints.getProvinces.initiate(undefined))
    }, [])
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<AuthorizeRoutes requireRoles={["ADMIN"]} />}>
                    <Route path="/admin" element={<AppLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="reports" element={<Report />} />
                        <Route path="blogs">
                            <Route index element={<BlogList />} />
                            <Route path="own-blogs" element={<OwnBlogList />} />
                            <Route path=":blogId/detail" element={<BlogDetail />} />
                            <Route path="create" element={<BlogCreate />} />
                        </Route>
                        <Route path="tags">
                            <Route index element={<TagList />} />
                        </Route>
                        <Route path="categories">
                            <Route index element={<CategoryList />} />
                        </Route>
                        <Route path="users">
                            <Route index element={<UserList />} />
                            <Route path=":userId/detail" element={<UserDetail />} />
                            <Route path="create" element={<UserCreate />} />
                        </Route>
                        <Route path="coupons">
                            <Route index element={<CouponList />} />
                        </Route>
                        <Route path="discount-campaigns">
                            <Route index element={<DiscountCampaignList />} />
                            <Route path=":campaignId/detail" element={<DiscountCampaignDetail />} />
                            <Route path="create" element={<DiscountCampaignCreate />} />
                        </Route>
                        <Route path="suppliers">
                            <Route index element={<SupplierList />} />
                            <Route path=":supplierId/detail" element={<SupplierDetail />} />
                            <Route path="create" element={<SupplierCreate />} />
                        </Route>
                        <Route path="transactions">
                            <Route index element={<TransactionList />} />
                            <Route path=":transactionId/detail" element={<TransactionDetail />} />
                            <Route path="create" element={<TransactionCreate />} />
                        </Route>
                        <Route path="banners">
                            <Route index element={<BannerList />} />
                            <Route path=":bannerId/detail" element={<BannerDetail />} />
                            <Route path="create" element={<BannerCreate />} />
                            <Route path="sort" element={<BannerSort />} />
                        </Route>
                        <Route path="products">
                            <Route index element={<ProductList />} />
                            <Route path=":productId/detail" element={<ProductDetail />} />
                            <Route path="create" element={<ProductCreate />} />
                        </Route>
                        <Route path="orders">
                            <Route index element={<OrderList />} />
                            <Route path=":orderId/detail" element={<OrderDetail />} />
                            <Route path="create" element={<OrderCreate />} />
                        </Route>
                        <Route path="payment-vouchers">
                            <Route index element={<PaymentVoucherList />} />
                            <Route path=":paymentVoucherId/detail" element={<PaymentVoucherDetail />} />
                            <Route path="create" element={<PaymentVoucherCreate />} />
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path="/admin/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { addressApi } from "./app/apis/address.api"
import { categoryApi } from "./app/apis/category.api"
import Layout from "./components/layout/Layout"
import PrivateRoutes from "./components/private/PrivateRoutes"
import RedirectRoutes from "./components/redirect/RedirectRoutes"
import ConfirmForgotPassword from "./pages/auth/confirm-forgot-password/ConfirmForgotPassword"
import ConfirmRegistration from "./pages/auth/confirm-registration/ConfirmRegistration"
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword"
import Login from "./pages/auth/login/Login"
import Register from "./pages/auth/register/Register"
import BlogDetails from "./pages/blog/blog-details/BlogDetails"
import BlogList from "./pages/blog/blog-list/BlogList"
import Home from "./pages/home/Home"
import ConfirmOrder from "./pages/payment/confirm-order/ConfirmOrder"
import PaymentOrder from "./pages/payment/payment-order/PaymentOrder"
import UserLayout from "./pages/user/UserLayout"
import Favorite from "./pages/user/favorite/Favorite"
import OrderHistory from "./pages/user/order-history/OrderHistory"
import Profile from "./pages/user/profile/Profile"
import Address from "./pages/user/profile/address/Address"
import Shop from "./pages/product/shop/Shop"
import ProductDetail from "./pages/product/product-details/ProductDetail"

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addressApi.endpoints.getProvinces.initiate(undefined))
    dispatch(categoryApi.endpoints.getCategories.initiate(undefined))
  }, [])


  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route element={<RedirectRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="dang-nhap" element={<Login />} />
          <Route path="dang-ky" element={<Register />} />
          <Route path="quen-mat-khau" element={<ForgotPassword />} />
          <Route path="dat-lai-mat-khau" element={<ConfirmForgotPassword />} />
          <Route path="xac-thuc-tai-khoan" element={<ConfirmRegistration />} />
        </Route>

        <Route path="danh-muc/:parentSlug" element={<Shop />} />
        <Route path="san-pham/:productId/:productSlug" element={<ProductDetail />} />

        <Route path="bai-viet">
          <Route index element={<BlogList />} />
          <Route path=":blogId/:blogSlug" element={<BlogDetails />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="khach-hang" element={<UserLayout />}>
            <Route path="tai-khoan" element={<Profile />} />
            <Route path="dia-chi" element={<Address />} />
            <Route path="phim-yeu-thich" element={<Favorite />} />
            <Route path="lich-su-giao-dich" element={<OrderHistory />} />
          </Route>


          <Route path="thanh-toan-don-hang/:orderId" element={<PaymentOrder />} />
          <Route path="xac-nhan-don-hang/:orderId" element={<ConfirmOrder />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

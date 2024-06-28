import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { addressApi } from "./app/apis/address.api"
import { cartApi } from "./app/apis/cart.api"
import { categoryApi } from "./app/apis/category.api"
import { favoriteApi } from "./app/apis/favorite.api"
import { initCart } from "./app/slices/cart.slice"
import { initFavorites } from "./app/slices/favorite.slice"
import ErrorPage from "./components/error/ErrorPage"
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
import Favorite from "./pages/favorite/Favorite"
import Home from "./pages/home/Home"
import Order from "./pages/order/Order"
import ConfirmOrder from "./pages/payment/confirm-order/ConfirmOrder"
import ProductDetail from "./pages/product/product-details/ProductDetail"
import Shop from "./pages/product/shop/Shop"
import ShoppingCart from "./pages/shopping-cart/ShoppingCart"
import UserLayout from "./pages/user/UserLayout"
import Address from "./pages/user/address/Address"
import OrderHistory from "./pages/user/order-history/OrderHistory"
import UpdatePassword from "./pages/user/password/UpdatePassword"
import Profile from "./pages/user/profile/Profile"

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addressApi.endpoints.getProvinces.initiate(undefined))
    dispatch(categoryApi.endpoints.getCategories.initiate(undefined))
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(favoriteApi.endpoints.getFavorites.initiate(undefined, { forceRefetch: true }))
      dispatch(cartApi.endpoints.getCart.initiate(undefined, { forceRefetch: true }))
    } else {
      dispatch(initFavorites())
      dispatch(initCart())
    }
  }, [isAuthenticated])

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

        <Route path="yeu-thich" element={<Favorite />} />
        <Route path="gio-hang" element={<ShoppingCart />} />
        <Route path="thanh-toan" element={<Order />} />
        <Route path="xac-nhan-don-hang/:orderId" element={<ConfirmOrder />} />

        <Route element={<PrivateRoutes />}>
          <Route path="khach-hang" element={<UserLayout />}>
            <Route path="tai-khoan" element={<Profile />} />
            <Route path="mat-khau" element={<UpdatePassword />} />
            <Route path="dia-chi" element={<Address />} />
            <Route path="lich-su-giao-dich" element={<OrderHistory />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage error={{ status: "NOT_FOUND" }} />} />
      </Route>
    </Routes>
  )
}

export default App

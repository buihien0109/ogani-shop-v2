import { configureStore } from "@reduxjs/toolkit";
import { checkStatusMiddleware } from "./middlewares/tokenExpirationMiddleware";
import { authApi } from "./services/auth.service";
import { auth2Api } from "./services/auth2.service";
import { bannerApi } from "./services/banner.service";
import { blogApi } from "./services/blog.service";
import { categoryApi } from "./services/category.service";
import { couponApi } from "./services/coupon.service";
import { dashboardApi } from "./services/dashboard.service";
import { discountCampaignApi } from "./services/discountCampaign.service";
import { imageApi } from "./services/image.service";
import { orderApi } from "./services/order.service";
import { paymentVoucherApi } from "./services/paymentVoucher.service";
import { productApi } from "./services/product.service";
import { productAttributeApi } from "./services/productAttribute.service";
import { reviewApi } from "./services/review.service";
import { roleApi } from "./services/role.service";
import { supplierApi } from "./services/supplier.service";
import { tagApi } from "./services/tag.service";
import { transactionApi } from "./services/transaction.service";
import { userApi } from "./services/user.service";
import addressReducer from "./slices/address.slice";
import authReducer from "./slices/auth.slice";
import imageReducer from "./slices/image.slice";
import { addressApi } from "./services/address.service";
import { userAddressApi } from "./services/userAddress.service";

const store = configureStore({
    reducer: {
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [auth2Api.reducerPath]: auth2Api.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
        [imageApi.reducerPath]: imageApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
        [discountCampaignApi.reducerPath]: discountCampaignApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [supplierApi.reducerPath]: supplierApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [paymentVoucherApi.reducerPath]: paymentVoucherApi.reducer,
        [productAttributeApi.reducerPath]: productAttributeApi.reducer,
        [addressApi.reducerPath]: addressApi.reducer,
        [userAddressApi.reducerPath]: userAddressApi.reducer,
        auth: authReducer,
        images: imageReducer,
        address: addressReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            blogApi.middleware,
            tagApi.middleware,
            imageApi.middleware,
            authApi.middleware,
            auth2Api.middleware,
            userApi.middleware,
            dashboardApi.middleware,
            reviewApi.middleware,
            couponApi.middleware,
            orderApi.middleware,
            roleApi.middleware,
            discountCampaignApi.middleware,
            productApi.middleware,
            categoryApi.middleware,
            supplierApi.middleware,
            transactionApi.middleware,
            bannerApi.middleware,
            paymentVoucherApi.middleware,
            productAttributeApi.middleware,
            addressApi.middleware,
            userAddressApi.middleware,
            checkStatusMiddleware
        ),
});

export default store;

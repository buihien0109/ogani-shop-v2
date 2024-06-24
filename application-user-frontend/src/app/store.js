import { configureStore } from "@reduxjs/toolkit";
import { addressApi } from "./apis/address.api";
import { authApi } from "./apis/auth.api";
import { auth2Api } from "./apis/auth2.api";
import { bannerApi } from "./apis/banner.api";
import { blogApi } from "./apis/blog.api";
import { cartApi } from "./apis/cart.api";
import { cartItemApi } from "./apis/cartItem.api";
import { categoryApi } from "./apis/category.api";
import { favoriteApi } from "./apis/favorite.api";
import { orderApi } from "./apis/order.api";
import { productApi } from "./apis/product.api";
import { reviewAnonymousApi } from "./apis/review.anonymous.api";
import { reviewApi } from "./apis/review.api";
import { tagApi } from "./apis/tag.api";
import { userApi } from "./apis/user.api";
import { userAddressApi } from "./apis/userAddress.api";
import { checkStatusMiddleware } from "./middlewares/tokenExpirationMiddleware";
import addressReducer from "./slices/address.slice";
import authReducer from "./slices/auth.slice";
import cartReducer from "./slices/cart.slice";
import categoryReducer from "./slices/category.slice";
import favoriteReducer from "./slices/favorite.slice";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [auth2Api.reducerPath]: authApi.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [addressApi.reducerPath]: addressApi.reducer,
        [userAddressApi.reducerPath]: userAddressApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewAnonymousApi.reducerPath]: reviewAnonymousApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [cartItemApi.reducerPath]: cartItemApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        auth: authReducer,
        address: addressReducer,
        categories: categoryReducer,
        favorites: favoriteReducer,
        cart: cartReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            auth2Api.middleware,
            blogApi.middleware,
            tagApi.middleware,
            favoriteApi.middleware,
            orderApi.middleware,
            userApi.middleware,
            reviewApi.middleware,
            addressApi.middleware,
            userAddressApi.middleware,
            categoryApi.middleware,
            productApi.middleware,
            reviewAnonymousApi.middleware,
            cartApi.middleware,
            cartItemApi.middleware,
            bannerApi.middleware,
            checkStatusMiddleware
        ),
});

export default store;
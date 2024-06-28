import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_CART_KEY } from '../../data/constants';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../utils/localStorageUtils';
import { cartApi } from '../apis/cart.api';

const initialState = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        initCart: (state, action) => {
            state = getDataFromLocalStorage(LOCAL_STORAGE_CART_KEY)
                ? getDataFromLocalStorage(LOCAL_STORAGE_CART_KEY)
                : []
            return state;
        },
        addToCart: (state, action) => {
            const { productId, quantity } = action.payload;
            const cartItem = state.find((item) => item.productId === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
            }
            else {
                state.push({ productId, quantity });
            }
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
            return state;
        },
        changeQuantityItem: (state, action) => {
            const { productId, quantity } = action.payload;
            const cartItem = state.find((item) => item.productId === productId);
            if (cartItem) {
                const newQuantity = cartItem.quantity + quantity;
                if (newQuantity > 0) {
                    cartItem.quantity = newQuantity;
                }
            }
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
            return state;
        },
        deleteFromCart: (state, action) => {
            const { productId } = action.payload;
            const newState = state.filter((item) => item.productId !== productId);
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, newState);
            return newState;
        },
        deleteAllFromCart: (state, action) => {
            state = [];
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
            return state;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            cartApi.endpoints.getCart.matchFulfilled,
            (state, action) => {
                const cartItems = action.payload.cartItems.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }));
                return cartItems;
            }
        );
    }
});

export const { initCart, addToCart, deleteFromCart, changeQuantityItem, deleteAllFromCart } = cartSlice.actions

export default cartSlice.reducer
import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_CART_KEY } from '../../data/constants';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../utils/localStorageUtils';


const initialState = getDataFromLocalStorage(LOCAL_STORAGE_CART_KEY)
    ? getDataFromLocalStorage(LOCAL_STORAGE_CART_KEY)
    : []

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId, quantity } = action.payload;
            console.log({ productId, quantity });
            const product = state.find((item) => item.productId === productId);
            if (product) {
                product.quantity += quantity;
            }
            else {
                state.push({ productId, quantity });
            }
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
            return state;
        },
        deleteFromCart: (state, action) => {
            const { productId, quantity } = action.payload;
            const product = state.find((item) => item.productId === productId);
            if (product) {
                product.quantity -= quantity;
                if (product.quantity <= 0) {
                    state = state.filter((item) => item.productId !== productId);
                }
            }
            setDataToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
            return state;
        },
    },
});

export const { addToCart, deleteFromCart } = cartSlice.actions

export default cartSlice.reducer
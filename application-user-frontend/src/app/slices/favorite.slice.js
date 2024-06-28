import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_FAVORITE_KEY } from '../../data/constants';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../utils/localStorageUtils';
import { favoriteApi } from '../apis/favorite.api';


const initialState = [];

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        initFavorites: (state, action) => {
            state = getDataFromLocalStorage(LOCAL_STORAGE_FAVORITE_KEY)
                ? getDataFromLocalStorage(LOCAL_STORAGE_FAVORITE_KEY)
                : [];
            return state;
        },
        addFavorite: (state, action) => {
            const { productId } = action.payload;
            const newState = [...new Set([productId, ...state])]
            setDataToLocalStorage(LOCAL_STORAGE_FAVORITE_KEY, newState);

            return newState;
        },
        deleteFavorite: (state, action) => {
            const { productId } = action.payload;
            const newState = state.filter((id) => id !== productId);
            setDataToLocalStorage(LOCAL_STORAGE_FAVORITE_KEY, newState);
            return newState;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            favoriteApi.endpoints.getFavorites.matchFulfilled,
            (state, action) => {
                const productIds = action.payload.map((product) => product.id);
                return productIds;
            }
        );
    }
});

export const { addFavorite, deleteFavorite, initFavorites } = favoriteSlice.actions

export default favoriteSlice.reducer
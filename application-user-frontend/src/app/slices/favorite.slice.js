import { createSlice } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_FAVORITE_KEY } from '../../data/constants';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../../utils/localStorageUtils';


const initialState = getDataFromLocalStorage(LOCAL_STORAGE_FAVORITE_KEY)
    ? getDataFromLocalStorage(LOCAL_STORAGE_FAVORITE_KEY)
    : []

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
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
        },
    },
});

export const { addFavorite, deleteFavorite } = favoriteSlice.actions

export default favoriteSlice.reducer
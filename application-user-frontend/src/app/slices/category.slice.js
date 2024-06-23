import { createSlice } from '@reduxjs/toolkit';
import { categoryApi } from '../apis/category.api';

const initialState = []

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            categoryApi.endpoints.getCategories.matchFulfilled,
            (state, action) => {
                state = action.payload;
                return state;
            }
        );
    }
});

export const { } = categorySlice.actions

export default categorySlice.reducer
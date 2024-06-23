import { createSlice } from '@reduxjs/toolkit';
import { addressApi } from '../apis/address.api';

const initialState = {
    provinces: [],
}

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            addressApi.endpoints.getProvinces.matchFulfilled,
            (state, action) => {
                state.provinces = action.payload;
            }
        );
    }
});

export const { } = addressSlice.actions

export default addressSlice.reducer
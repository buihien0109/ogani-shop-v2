import { createSlice } from '@reduxjs/toolkit';
import { addressApi } from '../services/address.service';

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
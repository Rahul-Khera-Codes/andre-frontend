import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: true,
    message: "",
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfileData: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.message = "";
        },
        profileFetchedFailed: (state, action) => {
            state.user = null;
            state.loading = false;
            state.message = action.payload;
        },
        discardData: (state) => {
            state.user = null;
            state.loading = true;
            state.message = "";
        }
    },
});

export const { getProfileData, discardData, profileFetchedFailed } = profileSlice.actions;

export default profileSlice.reducer;

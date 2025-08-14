import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: true,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfileData: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        discardData: (state) => {
            state.user = null;
            state.loading = true;
        }
    },
});

export const { getProfileData,discardData } = profileSlice.actions;

export default profileSlice.reducer;

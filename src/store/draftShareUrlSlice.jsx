import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
};

const draftShareUrlSlice = createSlice({
    name: 'draftUrl',
    initialState,
    reducers: {
        getDraftUrl: (state, action) => {
            state.data = action.payload;
        },
        discardDraftUrl: (state) => {
            state.data = null;
        }
    },
});

export const { getDraftUrl, discardDraftUrl } = draftShareUrlSlice.actions;

export default draftShareUrlSlice.reducer;

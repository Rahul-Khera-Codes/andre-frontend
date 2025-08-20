import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    msg: null,
    loading: true,
};

const loginStatusMsgSlice = createSlice({
    name: 'loginStatusMsg',
    initialState,
    reducers: {
        getLoginStatusMsg: (state, action) => {
            state.msg = action.payload;
            state.loading = false;
        },
        discardLoginStatusData: (state) => {
            state.msg = null;
            state.loading = true;
        }
    },
});

export const { getLoginStatusMsg,discardLoginStatusData } = loginStatusMsgSlice.actions;

export default loginStatusMsgSlice.reducer;

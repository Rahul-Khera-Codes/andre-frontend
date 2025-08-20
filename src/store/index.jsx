import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice"
import loginStatusMsgReducer from "./loginStatusMsgSlice"

const store = configureStore({
  reducer: {
    profile: profileReducer,
    loginStatusMsg: loginStatusMsgReducer
  },
});

export default store;
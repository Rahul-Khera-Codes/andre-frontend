import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice"
import loginStatusMsgReducer from "./loginStatusMsgSlice"
import draftShareUrlReducer from "./draftShareUrlSlice"

const store = configureStore({
  reducer: {
    profile: profileReducer,
    loginStatusMsg: loginStatusMsgReducer,
    draftUrl: draftShareUrlReducer
  },
});

export default store;
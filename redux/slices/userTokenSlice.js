import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "userToken",
  initialState: {
    token: null,
    userInfo: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
    }
  },
});

export const { setToken, removeToken, setUserInfo, removeUserInfo } = tokenSlice.actions;

export default tokenSlice;
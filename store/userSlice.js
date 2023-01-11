import { createSlice } from "@reduxjs/toolkit";

import Cookies from "universal-cookie";

const cookie = new Cookies();

let initialState = { user: cookie.get("EmicrolearnUser") };

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;

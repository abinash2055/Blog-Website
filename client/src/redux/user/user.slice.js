import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Update user and mark as logged in
    setUser: (state, action) => {
      const payload = action.payload;
      state.isLoggedIn = true;
      state.user = payload;
    },

    // Logout and reset user state
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

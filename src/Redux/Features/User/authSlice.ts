/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { decodedToken } from "../../../Utils/TokenDecode";
const apiBaseUrl = import.meta.env.VITE_LOCAL_BASE_URLL;
interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  userEmail: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
}

// Retrieve user data from localStorage if exists
const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("accessToken") || !!localStorage.getItem("userId"),
  userId: localStorage.getItem("userId") || null,
  userRole: localStorage.getItem("userRole") || null,
  userEmail: localStorage.getItem("userEmail") || null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { user_Email: string; user_Password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth`,
        credentials,
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      const decoded = decodedToken(accessToken);

      // Set access token in cookies
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      // Store user data in localStorage
      localStorage.setItem("userId", decoded.user_Id);
      localStorage.setItem("userRole", decoded.user_Role);
      localStorage.setItem("userEmail", decoded.user_Email);

      return {
        accessToken,
        userId: decoded.user_Id,
        userRole: decoded.user_Role,
        userEmail: decoded.user_Email,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Email or Password didn't match. Please try again."
      );
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${apiBaseUrl}/logOut`,
        {},
        { withCredentials: true }
      );
      Cookies.remove("accessToken");
      
      // Clear user data from localStorage on logout
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");

      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
  }
);

// Async thunk to refresh access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
       `${apiBaseUrl}/refresh-token`,
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      const decoded = decodedToken(accessToken);

      // Set new access token in cookies
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      

      return {
        accessToken,
        userId: decoded.user_Id,
        userRole: decoded.user_Role,
        userEmail: decoded.user_Email,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.userEmail = null;
      state.userId = null;

      // Clear from localStorage on logout
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userRole = action.payload.userRole;
        state.userEmail = action.payload.userEmail;
        state.userId = action.payload.userId; 
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.userEmail = null;
      state.userId = null;
    });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<any>) => {
        state.isAuthenticated = true;
        state.userRole = action.payload.userRole;
        state.userEmail = action.payload.userEmail;
        state.userId = action.payload.userId;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.userEmail = null;
        state.userId = null;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;

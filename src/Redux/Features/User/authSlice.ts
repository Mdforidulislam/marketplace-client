/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { decodedToken } from "../../../Utils/TokenDecode";

interface AuthState {
  isAuthenticated: boolean;
  userRole: string | null;
  userEmail: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!Cookies.get("accessToken"),
  userRole: null,
  userEmail: null,
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
      console.log(credentials);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth",
        credentials,
        {
          withCredentials: true, 
        }
      );
      

      console.log(response);

      const { accessToken } = response.data.data;

      const decoded = decodedToken(accessToken);

      // Set access token in cookies
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      return {
        accessToken,
        userRole: decoded.user_role,
        userEmail: decoded.user_Email,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
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
        "http://localhost:5000/api/v1/logOut",
        {},
        { withCredentials: true }
      );
      Cookies.remove("accessToken");
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
        "http://localhost:5000/api/v1/refresh-token",
        {
          withCredentials: true,
        }
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
        userRole: decoded.user_role,
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
    });

    // Refresh Token
    builder
      .addCase(
        refreshAccessToken.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isAuthenticated = true;
          state.userRole = action.payload.userRole;
          state.userEmail = action.payload.userEmail;
        }
      )
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.userEmail = null;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;

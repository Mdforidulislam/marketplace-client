/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface RegisterState {
  isRegistered: boolean;
  user: {
    user_Name: string | null;
    user_Address: string | null;
    user_Email: string | null;
    user_Password: string | null;
    user_PhoneNumber: string| null;
    user_Facebook: string| null;
    user_Skype?: string| null;
    user_Telegram?: string| null;
    user_Image: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  isRegistered: false,
  user: {
    user_Name: null,
    user_Address: null,
    user_Email: null,
    user_Password: null,
    user_PhoneNumber: null,
    user_Facebook: null,
    user_Skype: null,
    user_Telegram: null,
    user_Image: null,
  },
  loading: false,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (formData: RegisterState["user"], { rejectWithValue }) => {
    // console.log({user:formData});
    
    try {
      const response = await axios.post(
        "https://server.megaproxy.us/api/v1/create-user",
        {user:formData}
      );
      // console.log(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data || "Registration failed.");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegister: (state, action: PayloadAction<RegisterState["user"]>) => {
      state.isRegistered = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearRegister: (state) => {
      state.isRegistered = false;
      state.user = {
        user_Name: null,
        user_Address: null,
        user_Email: null,
        user_Password: null,
        user_PhoneNumber: null,
        user_Facebook: null,
        user_Skype: null,
        user_Telegram: null,
        user_Image: null,
      };
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistered = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRegister, clearRegister, setLoading, setError } = registerSlice.actions;

export default registerSlice.reducer;

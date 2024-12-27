/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_LOCAL_BASE_URLL;

interface AddPostState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AddPostState = {
  loading: false,
  success: false,
  error: null,
};

// Async thunk for adding a post
export const addPost = createAsyncThunk(
    'post/addPost',
    async (postData: { post: { author_id: string; productName: string; description: string; category: string; image: string | null } }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/create-post`, postData);
      console.log(response.data.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add post.');
    }
  }
);

const addPostSlice = createSlice({
  name: 'addPost',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state (loading)
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful post addition
      .addCase(addPost.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      // Handle failed post addition
      .addCase(addPost.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = addPostSlice.actions;

export default addPostSlice.reducer;

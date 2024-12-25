/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface PostDetailsState {
  postId: string | null;
  postData: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state of the detail page
const initialState: PostDetailsState = {
  postId: null,
  postData: null,
  loading: false,
  error: null,
};

// Fetch post details by ID
export const fetchPostDetails = createAsyncThunk(
  'detailPage/fetchPostDetails',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://server.megaproxy.us/api/v1/get-post/${postId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const detailPageSlice = createSlice({
  name: 'detailPage',
  initialState,
  reducers: {
    resetPostDetails: (state) => {
      state.postId = null;
      state.postData = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch post details
    builder
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.postData = action.payload;
        state.postId = action.payload._id;
      })
      .addCase(fetchPostDetails.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch post details'; // Type assertion to handle unknown payload
      });
  },
});

export const { resetPostDetails } = detailPageSlice.actions;
export default detailPageSlice.reducer;

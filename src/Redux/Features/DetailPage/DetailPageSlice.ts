/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_BASE_URL_production;

// Define the interface for user data
interface User {
  user_Id: string;
  user_Email: string;
  user_Name: string;
  user_PhoneNumber: string;
  user_Facebook: string;
  user_Skype: string;
  user_Telegram: string;
  user_Image: string;
  user_WhatsApp: string;
  user_blance: number;
  user_Address: string;
  user_varified: boolean;
  country: string;
  city: string;
}

// Define the interface for post data
interface Post {
  _id: string;
  likesCount: number;
  productName: string;
  productPrice: string;
  author_id: string;
  category: string;
  description: string;
  image: string;
}

// Define the state for the slice
interface PostDetailsState {
  postId: string | null;
  postData: Post | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PostDetailsState = {
  postId: null,
  postData: null,
  userData: null,
  loading: false,
  error: null,
};

// Async thunk to fetch post details along with user data
export const fetchPostDetails = createAsyncThunk(
  "detailPage/fetchPostDetails",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/get-single-post`, {
        params: { id: postId },
      });
      // console.log("Response from backend:", response.data.data);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post details"
      );
    }
  }
);

const detailPageSlice = createSlice({
  name: "detailPage",
  initialState,
  reducers: {
    resetPostDetails: (state) => {
      state.postId = null;
      state.postData = null;
      state.userData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPostDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          const { data } = action.payload;

          state.postData = {
            _id: data._id,
            likesCount: data.likesCount,
            category: data.category,
            productName: data.productName,
            description: data.description,
            image: data.image,
            author_id: data.author_id,
            productPrice: data.productPrice,
          };

          state.userData = data.user_Name
            ? {
                user_Id: data.user_Id,
                user_Email: data.user_Email,
                user_Name: data.user_Name,
                user_PhoneNumber: data.user_PhoneNumber,
                user_Facebook: data.user_Facebook,
                user_Skype: data.user_Skype,
                user_Telegram: data.user_Telegram,
                user_Image: data.user_Image,
                user_WhatsApp: data.user_WhatsApp,
                user_blance: data.user_blance,
                user_Address: data.user_Address,
                user_varified: data.user_varified,
                country: data.country,
                city: data.city,
              }
            : null;
        }
      )
      .addCase(
        fetchPostDetails.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error =
            (action.payload as string) || "Failed to fetch post details";
        }
      );
  },
});

export const { resetPostDetails } = detailPageSlice.actions;
export default detailPageSlice.reducer;

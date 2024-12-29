/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_BASE_URL_production;

interface Category {
  id: string;
  name: string;
}

const initialState: {
  categories: Category[];
  loading: boolean;
  error: string | null;
} = {
  categories: [],
  loading: false,
  error: null,
};
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/get-all-categories`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/add-category`,
        { name: categoryName }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data.data; // Success
    } catch (error: any) {
      console.error("Error in addCategory:", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch categories";
      })

      // Handling add category actions
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.categories.push(action.payload);
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;

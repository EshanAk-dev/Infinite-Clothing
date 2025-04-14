// slices/customDesignSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to save custom design
export const saveCustomDesign = createAsyncThunk(
  "customDesign/save",
  async (
    { color, designs, frontImageData, backImageData, shippingAddress, quantity = 1, price = 2000 },
    { rejectWithValue }
  ) => {
    try {
      // Convert front and back images to blobs
      const frontBlob = await fetch(frontImageData).then((res) => res.blob());
      const backBlob = await fetch(backImageData).then((res) => res.blob());

      const formData = new FormData();
      formData.append("frontDesignImage", frontBlob, "front-design.png");
      formData.append("backDesignImage", backBlob, "back-design.png");
      formData.append("color", color);
      formData.append("designs", JSON.stringify(designs));
      formData.append("shippingAddress", JSON.stringify(shippingAddress));
      formData.append("quantity", quantity);
      formData.append("price", price);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to fetch user's custom designs
export const fetchUserDesigns = createAsyncThunk(
  "customDesign/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to delete custom design
export const deleteCustomDesign = createAsyncThunk(
  "customDesign/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to view custom design by ID
export const fetchDesignById = createAsyncThunk(
  "customDesign/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const customDesignSlice = createSlice({
  name: "customDesign",
  initialState: {
    designs: [],
    currentDesign: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetDesignState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save design
      .addCase(saveCustomDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveCustomDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.designs.unshift(action.payload);
      })
      .addCase(saveCustomDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to save design";
      })
      // Fetch designs
      .addCase(fetchUserDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchUserDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch designs";
      })
      // Delete design
      .addCase(deleteCustomDesign.fulfilled, (state, action) => {
        state.designs = state.designs.filter(
          (design) => design._id !== action.payload
        );
      })
      // View design by ID
      .addCase(fetchDesignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch design";
      });
  },
});

export const { resetDesignState } = customDesignSlice.actions;
export default customDesignSlice.reducer;
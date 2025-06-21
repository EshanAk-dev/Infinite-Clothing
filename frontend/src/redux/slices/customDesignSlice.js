import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to save custom design
export const saveCustomDesign = createAsyncThunk(
  "customDesign/save",
  async (
    {
      color,
      designs,
      frontImageData,
      backImageData,
      rightArmImageData,
      leftArmImageData,
      shippingAddress,
      quantity = 1,
      price = 2000,
    },
    { rejectWithValue }
  ) => {
    try {
      const frontBlob = await fetch(frontImageData).then((res) => res.blob());
      const backBlob = await fetch(backImageData).then((res) => res.blob());
      const rightArmBlob = rightArmImageData
        ? await fetch(rightArmImageData).then((res) => res.blob())
        : null;
      const leftArmBlob = leftArmImageData
        ? await fetch(leftArmImageData).then((res) => res.blob())
        : null;

      const formData = new FormData();
      formData.append("frontDesignImage", frontBlob, "front-design.png");
      formData.append("backDesignImage", backBlob, "back-design.png");
      if (rightArmBlob)
        formData.append(
          "rightArmDesignImage",
          rightArmBlob,
          "right-arm-design.png"
        );
      if (leftArmBlob)
        formData.append(
          "leftArmDesignImage",
          leftArmBlob,
          "left-arm-design.png"
        );
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
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/user`,
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

// Async Thunk to view user's specific design
export const fetchUserDesignById = createAsyncThunk(
  "customDesign/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/user/${id}`,
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

// Async Thunk to delete user's design
export const deleteUserDesign = createAsyncThunk(
  "customDesign/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/user/${id}`,
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

const customDesignSlice = createSlice({
  name: "customDesign",
  initialState: {
    designs: [],
    currentDesign: null,
    loading: false,
    error: null,
    success: false,
    deleteSuccess: false,
  },
  reducers: {
    resetDesignState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deleteSuccess = false;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
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
      // Fetch design by ID
      .addCase(fetchUserDesignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchUserDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch design";
      })
      // Delete design
      .addCase(deleteUserDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteUserDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.designs = state.designs.filter(
          (design) => design._id !== action.payload
        );
        if (state.currentDesign?._id === action.payload) {
          state.currentDesign = null;
        }
      })
      .addCase(deleteUserDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete design";
      });
  },
});

export const { resetDesignState, clearCurrentDesign } =
  customDesignSlice.actions;
export default customDesignSlice.reducer;

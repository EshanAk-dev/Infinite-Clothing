import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch all designs (admin only)
export const fetchAllDesigns = createAsyncThunk(
  "adminCustomDesign/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/admin/all`,
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

// Async Thunk to update design status (admin only)
export const updateDesignStatus = createAsyncThunk(
  "adminCustomDesign/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/admin/${id}/status`,
        { status },
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

// Async Thunk to get design details (admin only)
export const fetchDesignDetailsAdmin = createAsyncThunk(
  "adminCustomDesign/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/admin/${id}`,
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

// Async Thunk to delete a design (admin only)
export const deleteDesignAdmin = createAsyncThunk(
  "adminCustomDesign/deleteDesign",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-designs/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminCustomDesignSlice = createSlice({
  name: "adminCustomDesign",
  initialState: {
    allDesigns: [],
    currentDesign: null,
    loading: false,
    error: null,
    success: false,
    deleteSuccess: false,
  },
  reducers: {
    resetAdminDesignState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deleteSuccess = false;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all designs
      .addCase(fetchAllDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.allDesigns = action.payload;
      })
      .addCase(fetchAllDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch designs";
      })
      // Update design status
      .addCase(updateDesignStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDesignStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.allDesigns.findIndex(
          (design) => design._id === action.payload._id
        );
        if (index !== -1) {
          state.allDesigns[index] = action.payload;
        }
        if (state.currentDesign?._id === action.payload._id) {
          state.currentDesign = action.payload;
        }
      })
      .addCase(updateDesignStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update status";
      })
      // Fetch design details
      .addCase(fetchDesignDetailsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignDetailsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchDesignDetailsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch design details";
      })
      // Delete design
      .addCase(deleteDesignAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteDesignAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.allDesigns = state.allDesigns.filter(
          (design) => design._id !== action.payload.id
        );
        if (state.currentDesign?._id === action.payload.id) {
          state.currentDesign = null;
        }
      })
      .addCase(deleteDesignAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete design";
      });
  },
});

export const { resetAdminDesignState, clearCurrentDesign } = adminCustomDesignSlice.actions;
export default adminCustomDesignSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications`,
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

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/unread`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Mark as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${notificationId}/read`,
        {},
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

// Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/mark-all-read`,
        {},
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

// Delete notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch notifications";
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch unread count";
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          n => n._id === action.payload._id
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex(n => n._id === action.payload);
        if (idx !== -1) {
          // If the notification was unread, decrement unreadCount
          if (!state.notifications[idx].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(idx, 1);
        }
      });
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * LOGIN USER THUNK
 * - Sends email & password to backend /login
 * - Saves token to localStorage if provided
 * - Returns token on success
 * - Returns error message on failure
 */
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(`/login`, {
        email: user.email,
        password: user.password,
      });

      // ✅ Save token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        return thunkAPI.fulfillWithValue(response.data); // return whole response (token + message)
      } else {
        return thunkAPI.rejectWithValue({
          message: "Token not provided",
        });
      }
    } catch (error) {
      // ✅ Return proper error response
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

/**
 * REGISTER USER THUNK
 * - Sends username, password, email, name to backend /register
 * - Returns success message if registration is successful
 * - Returns error message if user already exists or validation fails
 */
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      // ✅ Return backend response (success message, user, token if provided)
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      // ✅ Return backend error (e.g. "User already exists")
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

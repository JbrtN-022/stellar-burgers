import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  refreshToken,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';

export interface UserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  isAuthChecked: false,
  error: null
};

export const loginUserThunk = createAsyncThunk('user/login', loginUserApi);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  registerUserApi
);

export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

export const updateUserThunk = createAsyncThunk('user/update', updateUserApi);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  forgotPasswordApi
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  resetPasswordApi
);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    checkUserStatus: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUserStateSelector: (state) => state,
    getUserSelector: (state) => state.user,
    isAuthorizedSelector: (state) => state.isAuthorized,
    getUserErrorSelector: (state) => state.error,
    isAuthCheckedSelector: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(getUserThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthorized = true;
        state.user = payload.user;
        state.isAuthChecked = true;
      });
  }
});

export { initialState as userInitialState };
export const { clearUserError, checkUserStatus } = userSlice.actions;
export const {
  getUserStateSelector,
  getUserSelector,
  isAuthorizedSelector,
  getUserErrorSelector,
  isAuthCheckedSelector
} = userSlice.selectors;

export default userSlice.reducer;

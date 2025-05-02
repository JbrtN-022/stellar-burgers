import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';

// Интерфейс состояния пользователя
export interface UserState {
  isLoading: boolean; // Идет загрузка
  user: TUser | null; // Данные пользователя
  isAuthorized: boolean; // Авторизован ли пользователь
  isAuthChecked: boolean; // Проверена ли авторизация
  error: string | null; // Ошибки
}

// Начальное состояние
const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  isAuthChecked: false,
  error: null
};

// Асинхронные действия (thunks)

// Вход пользователя
export const loginUserThunk = createAsyncThunk('user/login', loginUserApi);

// Регистрация пользователя
export const registerUserThunk = createAsyncThunk(
  'user/register',
  registerUserApi
);

// Выход пользователя
export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

// Запрос на восстановление пароля
export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  forgotPasswordApi
);

// Сброс пароля
export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  resetPasswordApi
);

// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk('user/update', updateUserApi);

// Получение данных пользователя
export const getUserThunk = createAsyncThunk('user/get', getUserApi);

// Создание slice для пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Очистка ошибок
    clearUserError: (state) => {
      state.error = null;
    },
    // Проверка статуса пользователя
    checkUserStatus: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUserStateSelector: (state) => state, // Полное состояние
    getUserSelector: (state) => state.user, // Данные пользователя
    isAuthorizedSelector: (state) => state.isAuthorized, // Статус авторизации
    getUserErrorSelector: (state) => state.error // Ошибки
  },
  extraReducers: (builder) => {
    // Обработка состояний pending и rejected для всех actions
    const handlePending = (state: UserState) => {
      state.isLoading = true;
      state.error = null;
    };

    const handleRejected = (
      state: UserState,
      action: { error: { message: string } }
    ) => {
      state.isLoading = false;
      state.error = action.error.message;
    };

    // Общие обработчики для всех запросов
    builder
      .addMatcher((action) => action.type.endsWith('/pending'), handlePending)
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        handleRejected
      );

    // Успешные сценарии для каждого action
    builder
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken); // Сохраняем токен в куки
        localStorage.setItem('refreshToken', payload.refreshToken); // Сохраняем refreshToken
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
        deleteCookie('accessToken'); // Удаляем токен
        localStorage.removeItem('refreshToken'); // Удаляем refreshToken
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthorized = true;
        state.user = payload.user;
      });
  }
});

// Экспорты
export { initialState as userInitialState };
export const { clearUserError, checkUserStatus } = userSlice.actions;
export const {
  getUserStateSelector,
  getUserSelector,
  isAuthorizedSelector,
  getUserErrorSelector
} = userSlice.selectors;

export default userSlice.reducer;

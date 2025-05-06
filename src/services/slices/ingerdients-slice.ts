import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Типы для состояния ингредиентов
export interface ingredientsState {
  isLoading: boolean; // Флаг загрузки данных
  ingredients: TIngredient[]; // Список всех ингредиентов
  error: string | null; // Ошибка при загрузке
}

// Начальное состояние хранилища
const initialState: ingredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

// Асинхронный thunk для загрузки ингредиентов
export const getIngredientsThunk = createAsyncThunk(
  'ingredients/get', // Префикс для действий
  getIngredientsApi // API-функция для получения ингредиентов
);

// Создание слайса для работы с ингредиентами
const ingredientsSlice = createSlice({
  name: 'ingredients', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Редьюсеры не требуются (только async actions)
  selectors: {
    // Селектор всего состояния ингредиентов
    getIngredientsStateSelector: (state) => state,
    // Селектор только списка ингредиентов
    getIngredientsSelector: (state) => state.ingredients
  },
  // Обработка асинхронных действий
  extraReducers: (builder) => {
    builder
      // Начало загрузки ингредиентов
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.error = null; // Сбрасываем ошибки
      })
      // Ошибка при загрузке
      .addCase(getIngredientsThunk.rejected, (state, { error }) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.error = error.message as string; // Сохраняем текст ошибки
      })
      // Успешная загрузка
      .addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false; // Сбрасываем флаг загрузки
        state.error = null; // Сбрасываем ошибки
        state.ingredients = payload; // Сохраняем полученные ингредиенты
      });
  }
});

// Экспорты
export { initialState as ingredientsInitialState }; // Начальное состояние
export const {
  getIngredientsStateSelector, // Селектор всего состояния
  getIngredientsSelector // Селектор только ингредиентов
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer; // Экспорт редьюсера по умолчанию

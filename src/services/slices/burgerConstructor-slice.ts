import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

// Состояние конструктора бургеров
export interface burgerConstructorState {
  isLoading: boolean; // Статус загрузки
  constructorItems: {
    bun: TConstructorIngredient | null; // Выбранная булка
    ingredients: TConstructorIngredient[]; // Выбранные ингредиенты
  };
  orderRequest: boolean; // Статус запроса заказа
  orderModalData: TOrder | null; // Данные заказа для модалки
  error: string | null; // Ошибки
}

// Начальное состояние
const initialState: burgerConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Отправка заказа
export const sendOrderThunk = createAsyncThunk(
  'burgerConstructor/sendOrder',
  (data: string[]) => orderBurgerApi(data)
);

// Слайс конструктора бургеров
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const uniqId = nanoid(); // Генерация уникального ID
        return { payload: { ...ingredient, id: uniqId } };
      },
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { id: string }>
      ) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload; // Добавляем булку
        } else {
          state.constructorItems.ingredients.push(action.payload); // Добавляем ингредиент
        }
      }
    },
    // Удаление ингредиента
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id != action.payload
        );
    },
    // Установка статуса запроса заказа
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    // Очистка данных заказа
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    },
    // Перемещение ингредиента вниз
    moveIngredientDown: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload + 1]
      ] = [
        state.constructorItems.ingredients[action.payload + 1],
        state.constructorItems.ingredients[action.payload]
      ];
    },
    // Перемещение ингредиента вверх
    moveIngredientUp: (state, action) => {
      [
        state.constructorItems.ingredients[action.payload],
        state.constructorItems.ingredients[action.payload - 1]
      ] = [
        state.constructorItems.ingredients[action.payload - 1],
        state.constructorItems.ingredients[action.payload]
      ];
    }
  },
  selectors: {
    getConstructorSelector: (state) => state // Селектор состояния
  },
  extraReducers: (builder) => {
    builder
      // Отправка заказа начата
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Ошибка отправки заказа
      .addCase(sendOrderThunk.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = error.message as string;
      })
      // Заказ успешно отправлен
      .addCase(sendOrderThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = payload.order; // Сохраняем данные заказа
        // Очищаем конструктор
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

// Экспорты
export { initialState as burgerConstructorInitialState };
export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;

export const { getConstructorSelector } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;

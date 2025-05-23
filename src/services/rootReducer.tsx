import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorSlice from './slices/burgerConstructor-slice';
import feedSlice from './slices/feed-slice';
import orderSlice from './slices/order-slice';
import ingredientsSlice from './slices/ingredients-slice';
import userSlice from './slices/user-slice';
import { modalReducer } from './slices/modal-slice';
const rootReducer = combineReducers({
  modal: modalReducer,
  burgerConstructor: burgerConstructorSlice,
  feed: feedSlice,
  ingredients: ingredientsSlice,
  order: orderSlice,
  user: userSlice
});

export default rootReducer;

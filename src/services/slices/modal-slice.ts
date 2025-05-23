import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isOrderModalOpen: boolean;
  orderNumber: number | null;
  previousPath: string | null;
};

const initialState: ModalState = {
  isOrderModalOpen: false,
  orderNumber: null,
  previousPath: null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openOrderModal: (
      state,
      action: PayloadAction<{ number: number; previousPath: string }>
    ) => {
      state.isOrderModalOpen = true;
      state.orderNumber = action.payload.number;
      state.previousPath = action.payload.previousPath;
    },
    closeOrderModal: (state) => {
      state.isOrderModalOpen = false;
      state.orderNumber = null;
      state.previousPath = null;
    }
  }
});

export const { openOrderModal, closeOrderModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
export const selectModal = (state: { modal: ModalState }) => state.modal;

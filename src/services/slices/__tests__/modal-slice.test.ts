import { configureStore, Reducer } from '@reduxjs/toolkit';
import {
  modalReducer,
  openOrderModal,
  closeOrderModal,
  ModalState,
  initialState,
  selectModal
} from '../modal-slice';

// Определяем тип корневого состояния
type RootState = {
  modal: ModalState;
};

// Определяем тип редюсеров
type RootReducer = {
  modal: Reducer<ModalState>;
};

describe('Проверка редьюсера слайса модального окна', () => {
  // Проверка начального состояния
  it('должно возвращать начальное состояние', () => {
    const state = modalReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
    expect(state.isOrderModalOpen).toBe(false);
    expect(state.orderNumber).toBeNull();
    expect(state.previousPath).toBeNull();
  });

  // Проверка действия openOrderModal
  it('открытие модального окна с заказом', () => {
    const payload = { number: 123, previousPath: '/feed' };
    const action = openOrderModal(payload);
    const newState = modalReducer(initialState, action);

    expect(newState.isOrderModalOpen).toBe(true);
    expect(newState.orderNumber).toBe(123);
    expect(newState.previousPath).toBe('/feed');
  });

  // Проверка действия closeOrderModal
  it('закрытие модального окна', () => {
    const initialStateWithOpenModal: ModalState = {
      ...initialState,
      isOrderModalOpen: true,
      orderNumber: 123,
      previousPath: '/feed'
    };
    const action = closeOrderModal();
    const newState = modalReducer(initialStateWithOpenModal, action);

    expect(newState.isOrderModalOpen).toBe(false);
    expect(newState.orderNumber).toBeNull();
    expect(newState.previousPath).toBeNull();
  });

  // Проверка последовательных действий
  it('последовательное открытие и закрытие модального окна', () => {
    const payload = { number: 456, previousPath: '/profile/orders' };
    const openAction = openOrderModal(payload);
    const stateAfterOpen = modalReducer(initialState, openAction);

    expect(stateAfterOpen.isOrderModalOpen).toBe(true);
    expect(stateAfterOpen.orderNumber).toBe(456);
    expect(stateAfterOpen.previousPath).toBe('/profile/orders');

    const closeAction = closeOrderModal();
    const stateAfterClose = modalReducer(stateAfterOpen, closeAction);

    expect(stateAfterClose.isOrderModalOpen).toBe(false);
    expect(stateAfterClose.orderNumber).toBeNull();
    expect(stateAfterClose.previousPath).toBeNull();
  });

  // Проверка селектора
  it('селектор возвращает состояние модального окна', () => {
    const state: RootState = {
      modal: { isOrderModalOpen: true, orderNumber: 123, previousPath: '/feed' }
    };
    expect(selectModal(state)).toEqual(state.modal);
  });

  // Проверка иммутабельности
  it('openOrderModal не мутирует начальное состояние', () => {
    const payload = { number: 123, previousPath: '/feed' };
    const action = openOrderModal(payload);
    const originalState = { ...initialState };
    modalReducer(initialState, action);
    expect(initialState).toEqual(originalState);
    expect(initialState.isOrderModalOpen).toBe(false);
  });

  // Проверка интеграции с хранилищем
  describe('Интеграция с хранилищем', () => {
    let store: ReturnType<typeof configureStore<RootState>>;

    beforeEach(() => {
      store = configureStore({
        reducer: { modal: modalReducer } as RootReducer
      });
    });

    it('диспетчер открывает модальное окно', () => {
      store.dispatch(openOrderModal({ number: 123, previousPath: '/feed' }));
      const state = store.getState().modal;
      expect(state.isOrderModalOpen).toBe(true);
      expect(state.orderNumber).toBe(123);
      expect(state.previousPath).toBe('/feed');
    });

    it('диспетчер закрывает модальное окно', () => {
      store.dispatch(openOrderModal({ number: 123, previousPath: '/feed' }));
      store.dispatch(closeOrderModal());
      const state = store.getState().modal;
      expect(state.isOrderModalOpen).toBe(false);
      expect(state.orderNumber).toBeNull();
      expect(state.previousPath).toBeNull();
    });
  });
});

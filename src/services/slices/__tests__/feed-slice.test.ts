import feedSliceReducer, {
  getFeedThunk,
  feedInitialState,
  getOrdersThunk
} from '../feed-slice';
import { TOrder } from '@utils-types';

jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn()
}));

describe('Тестирование редьюсера слайса заказов', () => {
  describe('Проверка данных общего списка заказов', () => {
    it('ожидание загрузки общего списка заказов', () => {
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная загрузка общего списка заказов', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            name: 'Mocked order',
            status: 'done',
            createdAt: '',
            updatedAt: '',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload.orders);
      expect(state.total).toBe(payload.total);
      expect(state.totalToday).toBe(payload.totalToday);
      expect(state.error).toBeNull();
    });

    it('ошибка при загрузке общего списка заказов', () => {
      const error = { message: 'Ошибка при загрузке списка заказов' };
      const state = feedSliceReducer(
        feedInitialState,
        getFeedThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке списка заказов');
    });
  });

  describe('Проверка данных списка заказов пользователя', () => {
    it('ожидание загрузки списка заказов пользователя', () => {
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная загрузка списка заказов пользователя', () => {
      const payload: TOrder[] = [
        {
          _id: '1',
          name: 'Mocked User Order',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          number: 2,
          ingredients: []
        }
      ];
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('ошибка при загрузке списка заказов пользователя', () => {
      const error = { message: 'Ошибка при загрузке заказов пользователя' };
      const state = feedSliceReducer(
        feedInitialState,
        getOrdersThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка при загрузке заказов пользователя');
    });
  });
});
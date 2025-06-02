import userSliceReducer, {
  userInitialState,
  clearUserError,
  checkUserStatus,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getUserThunk,
  UserState
} from '../user-slice';
import { setCookie, deleteCookie } from '../../../utils/cookie';

const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
};

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage(),
    writable: true
  });
});

afterAll(() => {
  delete (global as any).localStorage;
});

describe('Тестирование редьюсера слайса пользователя', () => {
  it('проверка очистки ошибки', () => {
    const stateWithError: UserState = {
      ...userInitialState,
      error: 'Ошибка'
    };
    const state = userSliceReducer(stateWithError, clearUserError());
    expect(state.error).toBeNull();
  });

  it('проверка проверки статуса пользователя', () => {
    const isAuth: UserState = {
      ...userInitialState,
      isAuthChecked: true
    };
    const state = userSliceReducer(isAuth, checkUserStatus());
    expect(state.isAuthChecked).toBe(true);
  });

  describe('Тестирование авторизации', () => {
    const mockLogin = {
      email: 'mail@test.com',
      password: '12345'
    };

    it('ожидание процесса авторизации', () => {
      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.pending('testId', mockLogin)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная авторизация', () => {
      const payload = {
        success: true,
        user: { name: 'User Test', email: 'mail@test.com' },
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      };

      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.fulfilled(payload, 'testId', mockLogin)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('ошибка при авторизации', () => {
      const error = { message: 'Ошибка авторизации' };
      const args = { email: 'mail@test.com', password: 'password' };
      const state = userSliceReducer(
        userInitialState,
        loginUserThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('Тестирование регистрации', () => {
    it('ожидание процесса регистрации', () => {
      const args = {
        name: 'User Test',
        email: 'mail@test.com',
        password: '12345'
      };
      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная регистрация', () => {
      const payload = {
        success: true,
        user: { name: 'User New', email: 'new@test.com' },
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken'
      };

      const args = {
        name: 'User New',
        email: 'new@test.com',
        password: '12345'
      };

      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.fulfilled(payload, 'testId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.isAuthorized).toBe(true);
      expect(state.error).toBeNull();
      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        payload.accessToken
      );
      expect(localStorage.getItem('refreshToken')).toBe(payload.refreshToken);
    });

    it('ошибка при регистрации', () => {
      const error = { message: 'Ошибка регистрации' };
      const args = {
        name: 'User New',
        email: 'new@test.com',
        password: '12345'
      };

      const state = userSliceReducer(
        userInitialState,
        registerUserThunk.rejected(error as any, 'testId', args)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('Тестирование выхода', () => {
    it('ожидание процесса выхода', () => {
      const state = userSliceReducer(
        userInitialState,
        logoutUserThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешный выход из системы', () => {
      const state = userSliceReducer(
        {
          ...userInitialState,
          user: { name: 'User Test', email: 'mail@test.com' },
          isAuthorized: true
        },
        logoutUserThunk.fulfilled({ success: true }, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthorized).toBe(false);
      expect(state.error).toBeNull();
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('ошибка при выходе', () => {
      const error = { message: 'Ошибка выхода из системы' };
      const state = userSliceReducer(
        userInitialState,
        logoutUserThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка выхода из системы');
    });
  });

  describe('Тестирование обновления данных пользователя', () => {
    const args = {
      name: 'User Updated',
      email: 'updated@test.com'
    };

    it('ожидание обновления информации', () => {
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешное обновление данных пользователя', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.error).toBeNull();
    });

    it('ошибка при обновлении данных', () => {
      const error = { message: 'Ошибка обновления данных пользователя' };
      const state = userSliceReducer(
        userInitialState,
        updateUserThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка обновления данных пользователя');
    });
  });

  describe('Тестирование запроса восстановления пароля', () => {
    const args = {
      name: 'User Updated',
      email: 'updated@test.com'
    };

    it('ожидание процесса восстановления пароля', () => {
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешное восстановление пароля', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('ошибка при восстановлении пароля', () => {
      const error = { message: 'Ошибка восстановления пароля' };
      const state = userSliceReducer(
        userInitialState,
        forgotPasswordThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка восстановления пароля');
    });
  });

  describe('Тестирование запроса сброса пароля', () => {
    const args = {
      password: '12345',
      token: 'mockAccessToken'
    };

    it('ожидание процесса сброса пароля', () => {
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.pending('testId', args)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешный сброс пароля', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', password: '12345' }
      };
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.fulfilled(payload, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('ошибка при сбросе пароля', () => {
      const error = { message: 'Ошибка сброса пароля' };
      const state = userSliceReducer(
        userInitialState,
        resetPasswordThunk.rejected(error as any, 'testId', args)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сброса пароля');
    });
  });

  describe('Тестирование получения данных пользователя', () => {
    it('ожидание загрузки данных', () => {
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.pending('testId')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('успешная загрузка данных пользователя', () => {
      const payload = {
        success: true,
        user: { name: 'User Updated', email: 'updated@test.com' }
      };
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.fulfilled(payload, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(payload.user);
      expect(state.error).toBeNull();
    });

    it('ошибка при загрузке данных', () => {
      const error = { message: 'Ошибка получения данных пользователя' };
      const state = userSliceReducer(
        userInitialState,
        getUserThunk.rejected(error as any, 'testId')
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка получения данных пользователя');
    });
  });
});
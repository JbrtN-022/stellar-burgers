import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  isAuthorizedSelector,
  isAuthCheckedSelector
} from '../../services/slices/user-slice';
import { ReactElement } from 'react';
import { Preloader } from '@ui';
// Типы для защищенного маршрута
type TProtectedRoute = {
  onlyUnAuth?: boolean; // Только для неавторизованных
  children: ReactElement; // Дочерний элемент
};

// Компонент защищенного маршрута
export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRoute) => {
  const location = useLocation();
  const isAuthorized = useSelector(isAuthorizedSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const from = location.state?.from?.pathname || '/'; // Откуда пришел пользователь

  if (!isAuthChecked) {
    return <Preloader />; // Показываем индикатор загрузки
  }

  // Если нет дочерних элементов - ничего не рендерим
  if (!children) {
    return null;
  }

  // Если маршрут только для неавторизованных и пользователь авторизован
  if (onlyUnAuth && isAuthorized) {
    return <Navigate to={from} replace />; // Перенаправляем обратно
  }

  // Если маршрут для авторизованных и пользователь не авторизован
  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />; // На страницу входа
  }

  // Если все проверки пройдены - рендерим детей
  return children;
};

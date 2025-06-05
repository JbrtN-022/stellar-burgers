// src/components/protected-route.tsx
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  isAuthorizedSelector,
  isAuthCheckedSelector
} from '../../services/slices/user-slice';
import { ReactElement, useEffect } from 'react';
import { Preloader } from '@ui';
import {
  openOrderModal,
  closeOrderModal
} from '../../services/slices/modal-slice';

type TProtectedRoute = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRoute) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthorized = useSelector(isAuthorizedSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const { isOrderModalOpen, previousPath } = useSelector(
    (state) => state.modal
  );
  const from = location.state?.from?.pathname || '/';

  // Обработка модального окна заказов
  useEffect(() => {
    const match = location.pathname.match(/\/profile\/orders\/(\d+)/);
    if (match) {
      const orderNumber = parseInt(match[1], 10);
      dispatch(
        openOrderModal({
          number: orderNumber,
          previousPath: location.state?.from?.pathname || '/profile/orders'
        })
      );
    } else if (isOrderModalOpen) {
      dispatch(closeOrderModal());
    }
  }, [location.pathname, dispatch, isOrderModalOpen]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!children) {
    return null;
  }

  if (onlyUnAuth && isAuthorized) {
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUserThunk,
  clearUserError
} from '../../services/slices/user-slice';
import { useForm } from '../hooks/useForm';
export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const { values, handleChange, setValues } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk(values));
  };

  return (
    <LoginUI
      errorText={error?.toString()}
      email={values.email}
      setEmail={(value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function' ? value(values.email) : value;
        setValues({ ...values, email: newValue });
      }}
      password={values.password}
      setPassword={(value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function' ? value(values.password) : value;
        setValues({ ...values, password: newValue });
      }}
      handleSubmit={handleSubmit}
    />
  );
};

import { useState, ChangeEvent } from 'react';

export function useForm<T extends Record<string, any>>(
  inputValues: T = {} as T
) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value, name } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  return {
    values,
    handleChange,
    setValues
  };
}

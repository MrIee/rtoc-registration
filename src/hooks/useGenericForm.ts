import { useRef, useState, type ChangeEvent } from 'react';
import type { ReactSelectOption } from '../utilities/interfaces';

const useGenericForm = <T>(newFormDataObject: T) => {
  const [formData, setFormData] = useState<T>(newFormDataObject);
  const [errors, setErrors] = useState<T>(newFormDataObject);
  const isFormValid = useRef<boolean>(false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value });
  };

  const handleOnChangeDropdown = (option: ReactSelectOption, name: string) => {
    if (typeof option.value === 'string') {
      setFormData({ ...formData, [name]: option.value.toString() });
    }
  };

  const validateField = (name: string, message: string) => {
    const isValid: boolean = !!formData[name as keyof T];

    if (!isValid) {
      setErrors((prevErrors: T) => ({ ...prevErrors, [name]: message}));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: T) => ({ ...prevErrors, [name]: '' }));
    }
  };

  return { formData, setFormData, errors, setErrors, handleOnChangeDropdown, handleOnChange, validateField, isFormValid };
};

export default useGenericForm;
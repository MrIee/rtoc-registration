import classNames from "classnames";
import type { ChangeEvent } from "react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  error?: string;
  isPassword?: boolean;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

export const TextInput = ({ label, placeholder, name, value, error, isPassword, required = true, onChange, onBlur }: TextInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <label className="tw:w-full tw:inline-flex tw:flex-col tw:justify-start tw:mb-4">
      { label && <span>{label}{ required && (<span>*</span>)}</span> }
      <input
        className={classNames('tw:w-full', { 'tw:border-red-500 tw:border-2 tw:outline-red-500': error })}
        type={isPassword ? 'password' : 'text'}
        value={value}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      { error && <span className="tw:text-sm tw:text-red-500">{error}</span> }
    </label>
  );
};

export default TextInput;

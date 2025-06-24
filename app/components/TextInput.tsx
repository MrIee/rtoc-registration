interface TextInputProps {
  label: string;
  placeholder?: string;
  isPassword?: boolean;
  required?: boolean;
};

export const TextInput = ({ label, placeholder, isPassword, required = true }: TextInputProps) => {
  return (
    <label>
      <span>{label}{ required && (<span>*</span>)}</span>
      <input
        className="tw:w-full tw:mb-4"
        type={isPassword ? 'password' : 'text'}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
};

export default TextInput;

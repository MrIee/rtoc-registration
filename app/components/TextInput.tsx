interface TextInputProps {
  label: string;
  placeholder?: string;
  isPassword?: boolean;
};

export const TextInput = ({ label, placeholder, isPassword }: TextInputProps) => {
  return (
    <label>
      {label} <span className="tw:text-red-500">*</span>
      <input className="tw:w-full tw:mb-4" type={isPassword ? 'password' : 'text'} placeholder={placeholder} />
    </label>
  );
};

export default TextInput;

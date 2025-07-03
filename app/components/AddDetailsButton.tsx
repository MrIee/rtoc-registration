import plusIcon from '../assets/images/icon-plus.svg';
import type { FC } from 'react';

interface AddDetailsButtonProps {
  label: string;
  onClick: () => void;
};

const AddDetailsButton: FC<AddDetailsButtonProps> = ({ label, onClick }) => {
  return (
    <button className="btn btn--hollow tw:flex tw:ml-auto" onClick={onClick}>
      <img className="tw:mr-1.5" src={plusIcon} alt="plus icon" />
      {label}
    </button>
  );
};

export default AddDetailsButton;

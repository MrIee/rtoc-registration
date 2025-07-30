import classNames from 'classnames';
import plusIcon from '../../assets/images/icon-plus.svg';
import type { FC } from 'react';

interface AddDetailsButtonProps {
  classes?: string;
  label: string;
  onClick: () => void;
};

const AddDetailsButton: FC<AddDetailsButtonProps> = ({ classes, label, onClick }) => {
  return (
    <button className={classNames('btn btn--hollow tw:flex tw:items-center', classes)} onClick={onClick}>
      <img className="tw:h-4 tw:w-4 tw:mr-1.5" src={plusIcon} alt="plus icon" />
      {label}
    </button>
  );
};

export default AddDetailsButton;

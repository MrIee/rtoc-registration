import type { ReactNode } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { goToStep } from '~/store/registrationSlice';
import { type Step } from '../utilities/interfaces';

interface StepsProps {
  classes?: string;
  steps: Array<Step>;
  onClick?: (step: number) => void;
};

const Steps = ({ classes, steps, onClick }: StepsProps) => {
  const dispatch = useDispatch();
  const handleClick = (index: number) => {
    if (onClick) {
      onClick(index);
    }
    dispatch(goToStep(index));
  };
  const stepList: ReactNode = steps.map((step: Step, index: number) =>
    <div
        className={classNames('step', { 'step--active': step.active, 'tw:cursor-pointer': onClick })}
        key={index}
        onClick={() => handleClick(index)}
      >
      {step.label}
    </div>
  );

  return <div className={classNames('tw:w-full tw:flex tw:gap-1.5', classes)}>{stepList}</div>;
};

export default Steps;

import type { ReactNode } from "react";
import classNames from "classnames";
import { type Step } from "../utilities/interfaces";

interface StepsProps {
  classes?: string;
  steps: Array<Step>;
  onClick?: (step: number) => void;
};

const Steps = ({ classes, steps, onClick }: StepsProps) => {

  const stepList: ReactNode = steps.map((step: Step, index: number) =>
    <div className={classNames('tw:w-full', { 'tw:cursor-pointer': onClick })} key={index} onClick={() => onClick && onClick(index)}>
      <span className={classNames('step', { 'step--active': step.active })}>{step.label}</span>
    </div>
  );

  return <div className={classNames('tw:w-full tw:flex tw:gap-1.5', classes)}>{stepList}</div>;
};

export default Steps;

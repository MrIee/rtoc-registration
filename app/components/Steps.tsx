import type { ReactNode } from "react";
import classNames from "classnames";
import { type Step } from "../utilities/interfaces";

interface StepsProps {
  classes?: string;
  steps: Array<Step>;
};

const Steps = ({ classes, steps }: StepsProps) => {
  const stepList: ReactNode = steps.map((step: Step) =>
    <div className="tw:w-full tw:cursor-pointer" key={step.id}>
      <span className={classNames('step', { 'step--active': step.active })}>{step.label}</span>
    </div>
  );

  return <div className={classNames('tw:w-full tw:flex tw:gap-1.5', classes)}>{stepList}</div>;
};

export default Steps;
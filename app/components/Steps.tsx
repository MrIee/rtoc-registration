import type { ReactNode } from "react";
import { type Step } from "../utilities/interfaces";

interface StepsProps {
  steps: Array<Step>;
};

const Steps = ({ steps }: StepsProps) => {
  const stepList: ReactNode = steps.map((step: Step) =>
    <div className="tw:w-full tw:cursor-pointer" key={step.id}>
      <span className={`step ${step.active ? 'step--active': ''}`}>{step.label}</span>
    </div>
  );

  return <div className="tw:w-full tw:flex tw:gap-1.5">{stepList}</div>;
};

export default Steps;
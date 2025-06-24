import type { ReactElement } from "react";

export interface Step {
  label: string;
  active: boolean;
  component: ReactElement;
};

export interface ReactSelectOption {
  value: string | number;
  label: string;
}

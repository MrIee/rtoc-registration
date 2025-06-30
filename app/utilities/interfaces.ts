import type { FC, PropsWithChildren } from "react";

export interface RegistrationFormComponentProps extends PropsWithChildren {
  onValidate?: (isValid: boolean) => void;
};

export interface Step {
  label: string;
  active: boolean;
  component: FC;
};

export interface ReactSelectOption {
  value: string | number;
  label: string;
}

export interface UserDetails {
  firstname: string;
  familyname: string;
  preferredname: string;
  phone: string;
  email: string;
  password: string;
};

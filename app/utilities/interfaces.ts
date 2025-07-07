export interface Step {
  label: string;
  active: boolean;
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

export interface VETQualificationDetails {
  userid?: string;
  orgID?: string;
  orgName?: string;
  course?: string;
  title?: string;
  completed: string;
  qualification?: string;
};

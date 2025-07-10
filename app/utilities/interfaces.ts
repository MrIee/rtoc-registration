import type { ChangeEvent } from 'react';

export interface InputPropEvents {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

export interface InputPropsNoEvents {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  error?: string;
  required?: boolean;
};

export interface InputProps extends InputPropsNoEvents, InputPropEvents {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  error?: string;
  required?: boolean;
};

export interface Step {
  label: string;
  active: boolean;
};

export interface ReactSelectOption {
  id: string;
  value: unknown;
  label: string;
  __isNew__?: boolean;
};

export interface ListItem {
  id: number;
  title: string;
  list: Array<string>;
  points?: Array<string>;
  fileName?: string;
};

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
  OrgName?: string;
  course?: string;
  title?: string;
  completed: string;
  qualification?: string;
  rowID?: number;
};

export interface TEProvider {
  id: number,
  name: string,
};

export interface TECourse {
  aqf: number,
  course_name: string,
  id: number,
};

export interface TEQualification {
  providerID: string;
  providerName: string;
  courseID: string;
  courseName: string;
  aqf: string;
  completed: string;
  f_completed?: string;
  file: File | null;
  fileName: string;
  rowID?: number;
};

export interface Unit {
  rowID?: string;
  code?: string;
  pkgcode?: string;
  status?: string;
  title: string;
};

export interface TeachingExperience {
  orgID: string;
  orgName?: string;
  started: string;
  completed: string;
  units: Array<string> | Array<Unit> | string;
};

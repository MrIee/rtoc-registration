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
  readOnly?: boolean;
};

export interface InputProps extends InputPropsNoEvents, InputPropEvents {};

export interface Step {
  label: string;
  active: boolean;
  clickable: boolean;
};

export interface ReactSelectOption {
  id: string;
  value: unknown;
  label: string;
  __isNew__?: boolean;
};

export interface Point {
  id: number;
  label: string;
};

export interface ListItem {
  id?: number;
  title?: string;
  subtitle?: string;
  list?: Array<string>;
  points?: Array<Point>;
  fileName?: string;
};

export interface UserDetails {
  URL?: string;
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
  rowID?: number;
  code?: string;
  pkgcode?: string;
  status?: string;
  title: string;
  unit?: string;
};

export interface TeachingExperienceData {
  orgID: string;
  started: string;
  completed: string;
  course: string;
  units: Array<string>;
  unitsMsg: string;
};

export interface TeachingExperience {
  orgID: string;
  orgName: string;
  started: string;
  completed: string;
  units?: Array<Unit>;
  courses?: Array<TeachingExperienceCourse>;
};

export interface TeachingExperienceCourse {
  course: string;
  courseTitle: string;
  units: Array<TeachingExperienceUnit>;
};

export interface TeachingExperienceUnit {
  f_completed: string;
  f_started: string;
  rowID: number;
  unit: string;
  unitTitle: string;
};

export interface IndustryExperienceData {
  companyName: string;
  ABN: string;
  positionTitle: string;
  started: string;
  completed: string | null;
  file: File | null;
  fileName: string;
  units: Array<string>;
  unitsMsg?: string;
};

export interface IndustryExperience {
  rowID: number;
  companyName: string;
  Company?: string;
  ABN: string;
  positionDescription: string;
  positionTitle: string;
  started: string;
  completed: string | null;
  units: Array<Unit>;
};

export interface UnitsICanTeachData {
  orgID: string;
  units: Array<string>;
  unitsMsg?: string;
};

export interface UnitsICanTeach {
  orgID: string;
  orgName: string;
  units: Array<Unit>;
};
export interface Profile {
  firstname: string;
  familyname: string;
  type: string;
  industry: Array<IndustryExperience>,
  qualifications: Array<TEQualification>,
  vetQuals: Array<VETQualificationDetails>,
  vetTeach: Array<TeachingExperience>,
};

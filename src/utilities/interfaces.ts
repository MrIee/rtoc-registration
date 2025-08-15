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
  defaultValue?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  isSlim?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
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

export interface Row {
  rowID?: number;
}

export interface UserDetails {
  URL?: string;
  firstname: string;
  familyname: string;
  preferredname: string;
  phone: string;
  email: string;
  password: string;
};

export interface VETQualificationDetails extends Row {
  userid?: string;
  orgID?: string;
  orgName?: string;
  OrgName?: string;
  course?: string;
  title?: string;
  completed: string;
  qualification?: string;
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

export interface TEQualification extends Row {
  providerID: string;
  providerName: string;
  courseID: string;
  courseName: string;
  aqf: string;
  completed: string;
  f_completed?: string;
  file: File | null;
  fileName: string;
};

export interface Unit extends Row {
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
  orgID?: string;
  orgName: string;
  started?: string;
  completed?: string;
  units?: Array<Unit>;
  courses?: Array<TeachingExperienceCourse>;
};

export interface TeachingExperienceCourse {
  course: string;
  courseTitle: string;
  units: Array<TeachingExperienceUnit>;
};

export interface TeachingExperienceUnit extends Row {
  f_completed?: string;
  f_started?: string;
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

export interface IndustryExperience extends Row {
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

export interface MatrixExperience extends Omit<TeachingExperience, 'courses'> {
  courses: Array<MatrixExperienceCourse>;
};

export interface MatrixExperienceCourse extends Omit<TeachingExperienceCourse, 'units'> {
  units: Array<MatrixExperienceUnit>;
};

export interface MatrixExperienceUnit extends TeachingExperienceUnit {
  eq_unit1: string;
  eq_unit2: string;
  eq_unit3: string;
  experience: string;
  hold_unit: number;
  hold_unit_text: string;
};

export interface Activity extends Row {
  activity: string;
  date: string;
  duration: string;
  mode: string,
  outcomes: string;
  provider: string;
  section: string;
  year_category: string;
};

export const newActivity = {
  activity: '',
  date: '',
  duration: '',
  mode: '',
  outcomes: '',
  provider: '',
  section: '',
  year_category: '',
};

export interface GroupedActivity {
  current: Array<Activity>;
  previous: Array<Activity>;
};
export interface GroupedActivities {
  industry: GroupedActivity;
  VET: GroupedActivity;
};

export const newGroupedActivities: GroupedActivities = {
  industry: { current: [], previous: [] },
  VET: { current: [], previous: [] },
};

export interface Subscription extends Row {
  anniversary: string;
  commenced: string;
  current?: string;
  member: string;
  provider: string;
  renewal: string;
  section: string;
};

export interface GroupedSubscription {
  industry: Array<Subscription>,
  VET: Array<Subscription>,
};

export const newGroupedSubscriptions: GroupedSubscription = {
  industry: [],
  VET: [],
};

import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { nanoid } from 'nanoid';
import {
  type ReactSelectOption,
  type UserDetails,
  type VETQualificationDetails,
  type TEProvider,
  type TECourse,
  type Unit,
  type TEQualification,
  type TeachingExperienceData,
  type IndustryExperienceData,
  type UnitsICanTeachData,
  type Activity,
  type Subscription,
  newGroupedActivity,
  newGroupedSubscription,
} from './interfaces';
import { EXPERIENCE_TYPES } from '../utilities/constants';
interface Organisation {
  id: number;
  name: string;
};

interface Course {
  pkgcode: string;
  status: string;
  title: string;
};

const SESSION_KEY_ITEM = 'rtoc-user-session-key';

export const getSessionKey = (): string => {
  return localStorage.getItem(SESSION_KEY_ITEM) || '';
};

axios.defaults.baseURL = 'https://vps1.w617.com:5000';

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => Promise.reject(err?.response?.data),
);

// =============================================================================
// User Endpoints
// =============================================================================

export const getUser = async () => {
  try {
    const res = await axios.get('/user', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch(err) {
    return err;
  }
};

export const createUser = async (userDetails: UserDetails) => {
  try {
    const res: AxiosResponse = await axios.post('/add', userDetails);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const authUser = async (email: string, password: string) => {
  try {
    const res = await axios.post('/auth', { email, password });
    const { auth } = res.data;

    if (auth) {
      localStorage.setItem(SESSION_KEY_ITEM, res.data['sessionKey:']);
    }

    return res.data;
  } catch {
    return null;
  }
};

export const userHasAuth = () => {
  return localStorage.getItem(SESSION_KEY_ITEM);
};

export const getUserProfile = async (url: string) => {
  try {
    const res = await axios.get('/profile/' + url);
    return res.data[0];
  } catch {
    return null;
  }
};

// =============================================================================
// Organisation, Course and Unit Endpoints
// =============================================================================

const getOrganisations = async (name: string) => {
  try {
    const res = await axios.get('/tga_organisations/search/' + name);
    return res.data;
  } catch {
    return [];
  }
};


export const getOrganisationsAsOptions = async (searchTerm: string): Promise<Array<ReactSelectOption>> => {
  try {
    const organisations: Array<Organisation> = await getOrganisations(searchTerm);
    return organisations.map((org: Organisation) => ({ id: nanoid(), value: org.id.toString(), label: org.name }));
  } catch {
    return [];
  }
};

export const getOrganisationByIdAsOption = async (id: string): Promise<ReactSelectOption | null> => {
  try {
    const res = await axios.get('/tga_organisation/' + id);
    return { id: '1', value: res.data.id.toString(), label: res.data.name };
  } catch {
    return null;
  }
};

const getTAECourses = async (id: string) => {
  try {
    const res = await axios.get('/tga_organisation/tae_courses/' + id);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getTAECoursesAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const courses: Array<Course> = await getTAECourses(id);
    return courses.map((course: Course) => ({ id: nanoid(), value: course.pkgcode, label: `${course.pkgcode} - ${course.title}`}));
  } catch {
    return [];
  }
};

const getCourses = async (id: string) => {
  try {
    const res = await axios.get('tga_organisation/courses/' + id);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getCoursesAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const courses: Array<Course> = await getCourses(id);
    return courses.map((course: Course) => ({ id: nanoid(), value: course.pkgcode, label: `${course.pkgcode} - ${course.title}`}));
  } catch {
    return [];
  }
};

export const getUnitsFromCourse= async (id: string) => {
  try {
    const res = await axios.get('course_units/' + id);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getUnitsFromCourseAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const units: Array<Unit> = await getUnitsFromCourse(id);
    return units.map((unit: Unit) => ({ id: nanoid(), value: unit.code, label: `${unit.code} - ${unit.title}`}));
  } catch {
    return [];
  }
};

export const getUnitsFromOrg = async (id: string) => {
  try {
    const res = await axios.get('tga_organisation/units/' + id);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getUnitsFromOrgAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const units: Array<Unit> = await getUnitsFromOrg(id);
    return units.map((unit: Unit) => ({ id: nanoid(), value: unit.pkgcode, label: `${unit.pkgcode} - ${unit.title}`}));
  } catch {
    return [];
  }
};

// =============================================================================
// VET Qualifications Endpoints
// =============================================================================

export const createVETQualifications = async (qualificationDetails: VETQualificationDetails) => {
  try {
    const res = await axios.post('/user/qualifications/vet', qualificationDetails, {
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};

export const deleteVETQualification = async (id: number) => {
  try {
    const res = await axios.delete('/user/qualifications/vet', {
      data: { rowID: id },
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};


export const getVETQualifications = async () => {
  try {
    const res = await axios.get('/user/qualifications/vet', {
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return [];
  }
};

// =============================================================================
// Higher Education Endpoints
// =============================================================================

const getTEProviders = async (searchTerm: string) => {
  try {
    const res = await axios.get('te_providers/search/' + searchTerm);
    return res.data;
  } catch(err) {
  return err;
  }
};

export const getTEProvidersAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const providers: Array<TEProvider> = await getTEProviders(id);
    return providers.map((provider: TEProvider) => ({ id: nanoid(), value: provider, label: provider.name}));
  } catch {
    return [];
  }
};

const getTECourses = async (id: string) => {
  try {
    const res = await axios.get('te_providers/courses/' + id);
    return res.data;
  } catch(err) {
  return err;
  }
};

export const getTECoursesAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const courses: Array<TECourse> = await getTECourses(id);
    return courses.map((course: TECourse) => ({ id: nanoid(), value: course, label: course.course_name}));
  } catch {
    return [];
  }
};

export const createTEQualifications = async (data: TEQualification) => {
  try {
    const formData = new FormData();
    const dataJSON: string = JSON.stringify({
      providerID: data.providerID,
      providerName: data.providerName,
      courseID: data.courseID,
      courseName: data.courseName,
      aqf: data.aqf,
      completed: data.completed,
    });
    formData.append('formData', dataJSON);

    if (data.file) {
      formData.append('file', data.file);
    }

    const res = await axios.post('/user/qualifications/te', formData, {
      headers: { 'x-session': getSessionKey(), 'Content-Type': 'multipart/form-data' },
    });

   return res.data;
  } catch {
    return null;
  }
};

export const getTEQualifications = async () => {
  try {
    const res = await axios.get('/user/qualifications/te', {
      headers: { 'x-session': getSessionKey() },
    });

     const qualifications: Array<TEQualification> = res.data.map((qualification: TEQualification) => ({
      providerID: qualification.providerID,
      providerName: qualification.providerName,
      courseID: qualification.courseID,
      courseName: qualification.courseName,
      aqf: qualification.aqf,
      completed: qualification.f_completed,
      fileName: qualification.fileName,
      rowID: qualification.rowID,
    }));

    return qualifications;
  } catch {
    return [];
  }
};

export const deleteTEQualification = async (id: number) => {
  try {
    const res = await axios.delete('/user/qualifications/te', {
      data: { rowID: id },
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};

// =============================================================================
// Teaching Experience Endpoints
// =============================================================================

export const createTeachingExperience = async (data: TeachingExperienceData) => {
  try {
    const res = await axios.post('/user/experience/vet_teach', data, {
      headers: { 'x-session': getSessionKey() },
    });

   return res.data;
  } catch {
    return null;
  }
};

export const getTeachingExperience = async () => {
  try {
    const res = await axios.get('/user/experience/vet_teach/', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const deleteTeachingExperience = async (id: number) => {
  try {
    const res = await axios.delete('/user/experience/vet_teach/', {
      data: { rowID: id },
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};

export const getTaughtUnits = async (): Promise<Array<ReactSelectOption>> => {
  try {
    const units = await axios.get('/user/related_teach', {
      headers: { 'x-session': getSessionKey() },
    });

    return units.data.map((unit: Unit) => ({ id: nanoid(), value: unit.unit, label: unit.title }));
  } catch {
    return [];
  }
};

// =============================================================================
// Industry Experience Endpoints
// =============================================================================

export const createIndustryExperience = async (data: IndustryExperienceData) => {
  try {
    const formData = new FormData();
    const dataJSON: string = JSON.stringify({
      companyName: data.companyName,
      ABN: data.ABN,
      positionTitle: data.positionTitle,
      started: data.started,
      completed: data.completed,
      units: data.units,
    });
    formData.append('formData', dataJSON);

    if (data.file) {
      formData.append('file', data.file);
    }

    const res = await axios.post('/user/experience/industry', formData, {
      headers: { 'x-session': getSessionKey(), 'Content-Type': 'multipart/form-data' },
    });

   return res.data;
  } catch {
    return null;
  }
};

export const getIndustryExperience = async () => {
  try {
    const res = await axios.get('/user/experience/industry', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const deleteIndustryExperience = async (id: number) => {
  try {
    const res = await axios.delete('/user/experience/industry', {
      data: { rowID: id },
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};

export const lookupABN = async (abn: string) => {
  try {
    const formattedABN = abn.replace(/[\s-]/g, '');

    if (formattedABN && /^\d{11}$/.test(formattedABN)) {
      const res = await axios.get('/abn_lookup/' + formattedABN);
      return res.data;
    }

    return null;
  } catch(err) {
    return err;
  }
};

// =============================================================================
// Units I can Teach Endpoints
// =============================================================================

export const createUnitsICanTeach = async (data: UnitsICanTeachData) => {
  try {
    const res = await axios.post('/user/experience/canteach', data, {
      headers: { 'x-session': getSessionKey() },
    });

   return res.data;
  } catch {
    return null;
  }
};

export const getUnitsICanTeach = async () => {
  try {
    const res = await axios.get('/user/experience/canteach', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const deleteUnitsICanTeach = async (id: number) => {
  try {
    const res = await axios.delete('/user/experience/canteach', {
      data: { rowID: id },
      headers: { 'x-session': getSessionKey() },
    });
    return res.data;
  } catch {
    return null;
  }
};

// =============================================================================
// Trainers Matrix Endpoints
// =============================================================================

export const getMatrixTeachingExperience = async () => {
  try {
    const res = await axios.get('/user/matrix/teach', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

const getMatrixActivities = async () => {
  try {
    const res = await axios.get('/user/matrix/activities', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const getMatrixActivitiesGrouped = async () => {
  try {
    const activities: Array<Activity> = await getMatrixActivities();
    const activitiesGrouped = newGroupedActivity;

    activities.forEach((activity: Activity) => {
      if (activity.section === EXPERIENCE_TYPES.INDUSTRY) {
        if (activity.year_category === 'current') {
          activitiesGrouped.industry.current.push(activity);
        }

        if (activity.year_category === 'previous') {
          activitiesGrouped.industry.previous.push(activity);
        }
      }

      if (activity.section === EXPERIENCE_TYPES.VET) {
        if (activity.year_category === 'current') {
          activitiesGrouped.VET.current.push(activity);
        }

        if (activity.year_category === 'previous') {
          activitiesGrouped.VET.previous.push(activity);
        }
      }
    });

    return activitiesGrouped;
  } catch {
    return newGroupedActivity;
  }
};

const getSubscriptions = async () => {
  try {
    const res = await axios.get('/user/matrix/subscriptions', {
      headers: { 'x-session': getSessionKey() },
    });

    return res.data;
  } catch {
    return [];
  }
};

export const getSubscriptionsGrouped = async () => {
  try {
    const subscriptions: Array<Subscription> = await getSubscriptions();
    const subscriptionsGrouped = newGroupedSubscription;

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription.section === EXPERIENCE_TYPES.INDUSTRY) {
        subscriptionsGrouped.industry.push(subscription);
      }

      if (subscription.section === EXPERIENCE_TYPES.VET) {
        subscriptionsGrouped.VET.push(subscription);
      }
    });

    return subscriptionsGrouped;
  } catch {
    return newGroupedSubscription;
  }
};

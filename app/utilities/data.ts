import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { nanoid } from 'nanoid';
import type { ReactSelectOption, UserDetails, VETQualificationDetails, TEProvider, TECourse, Unit, TEQualification, TeachingExperience } from './interfaces';

interface Organisation {
  id: number;
  name: string;
};

interface Certification {
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

const getCertification = async (id: string) => {
  try {
    const res = await axios.get('tga_organisation/courses/' + id);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getCertificationsAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const certifications: Array<Certification> = await getCertification(id);
    return certifications.map((cert: Certification) => ({ id: nanoid(), value: cert.pkgcode, label: `${cert.pkgcode} - ${cert.title}`}));
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

const getTECourses = async (id: number) => {
  try {
    const res = await axios.get('te_providers/courses/' + id);
    return res.data;
  } catch(err) {
  return err;
  }
};

export const getTECoursesAsOptions = async (id: number): Promise<Array<ReactSelectOption>> => {
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

export const getUnits = async (id: string) => {
  try {
    const res = await axios.get('tga_organisation/units/' + id);
    return { ...res.data, code: res.data.pkgcode };
  } catch(err) {
    return err;
  }
};

export const getUnitsAsOptions = async (id: string): Promise<Array<ReactSelectOption>> => {
  try {
    const units: Array<Unit> = await getUnits(id);
    return Object.keys(units).map((key: string) => {
      const k: keyof Array<Unit> = key as keyof typeof units;
      const unit = units[k] as Unit;

      if (unit) {
        return { id: nanoid(), value: unit.pkgcode, label: `${unit.pkgcode} - ${unit.title}`};
      }

      return { id: '', value: '', label: ''};
    });
  } catch {
    return [];
  }
};

export const createTeachingExperience = async (data: TeachingExperience) => {
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

import axios, { type AxiosError, type AxiosResponse } from "axios";
import { type ReactSelectOption, type UserDetails, type VETQualificationDetails } from "./interfaces";

export interface Organisation {
  id: number;
  name: string;
};

export interface Certification {
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
  } catch(err) {
    return err;
  }
};

export const createVETQualifications = async (qualificationDetails: VETQualificationDetails) => {
  try {
    const res = await axios.post('/user/qualifications/vet', qualificationDetails, {
      headers: { 'X-session': getSessionKey(), 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch(err) {
    return err;
  }
};

const getOrganisations = async (name: string) => {
  try {
    const res = await axios.get('/tga_organisations/search/' + name);
    return res.data;
  } catch(err) {
    return err;
  }
};

export const getOrganisationsAsOptions = async (name: string): Promise<Array<ReactSelectOption>> => {
  try {
    const organisations: Array<Organisation> = await getOrganisations(name);
    return organisations.map((org: Organisation) => ({ value: org.id.toString(), label: org.name }));
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
    return certifications.map((cert: Certification) => ({ value: cert.pkgcode, label: `${cert.pkgcode} - ${cert.title}`}));
  } catch {
    return [];
  }
};

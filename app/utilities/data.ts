import axios, { type AxiosError, type AxiosResponse } from "axios";
import { type ReactSelectOption, type UserDetails } from "./interfaces";

export interface Organisation {
  id: number;
  name: string;
};

export interface Certification {
  pkgCode: string;
  status: string;
  title: string;
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
  const res = await axios.post('/auth', { email, password });
  return res;
};

const getOrganisations = async (name: string): Promise<Array<Organisation>> => {
  const res = await axios.get(`/tga_organisations/search/${name}`);
  return res.data;
};

export const getOrganisationsAsOptions = async (name: string): Promise<Array<ReactSelectOption>> => {
  const organisations: Array<Organisation> = await getOrganisations(name);
  return organisations.map((org: Organisation) => ({ value: org.id, label: org.name }));
};

const getCertification = async (id: number): Promise<Array<Certification>> => {
  const res = await axios.get(`/tga_organisation/courses/${id}`);
  return res.data;
};

export const getCertificationsAsOptions = async (id: number): Promise<Array<ReactSelectOption>> => {
  const certifications: Array<Certification> = await getCertification(id);
  return certifications.map((cert: Certification) => ({ value: cert.pkgCode, label: cert.title }));
};

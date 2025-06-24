import axios from "axios";
import { type ReactSelectOption } from "./interfaces";

export interface Organisation {
  id: number;
  name: string;
};

export interface Certification {
  pkgCode: string;
  status: string;
  title: string;
};


const BASE_URL = 'https://vps1.w617.com:5000';

const getOrganisations = async (name: string): Promise<Array<Organisation>> => {
  try {
    const res = await axios.get(`${BASE_URL}/tga_organisations/search/${name}`);
    return res.data;
  } catch {
    return [];
  }
};

export const getOrganisationsAsOptions = async (name: string): Promise<Array<ReactSelectOption>> => {
  const organisations: Array<Organisation> = await getOrganisations(name);
  return organisations.map((org: Organisation) => ({ value: org.id, label: org.name }));
};

const getCertification = async (id: number): Promise<Array<Certification>> => {
  try {
    const res = await axios.get(`${BASE_URL}/tga_organisation/courses/${id}`);
    return res.data;
  } catch {
    return [];
  }
};

export const getCertificationsAsOptions = async (id: number): Promise<Array<ReactSelectOption>> => {
  const certifications: Array<Certification> = await getCertification(id);
  console.log('certifications:', certifications);
  return certifications.map((cert: Certification) => ({ value: cert.pkgCode, label: cert.title }));
};


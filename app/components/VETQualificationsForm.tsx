import { getOrganisationsAsOptions, getCertificationsAsOptions } from '~/utilities/data';
import debounce from 'lodash.debounce';
import Dropdown from "./Dropdown";
import { type ReactSelectOption } from '../utilities/interfaces';
import { useState } from 'react';
import DatePicker from './DatePicker';

const VETQualificationsForm = () => {
  const initialCertificationPlaceholder: string = 'Select an RTO to see Cerficatations';
  const [certificationOptions, setCertificationOptions] = useState<Array<ReactSelectOption>>([]);
  const [isCertificationsLoading, setIsCertificationsLoading] = useState<boolean>(true);
  const [certificationPlaceholder, setCertificationPlaceholder] = useState<string>(initialCertificationPlaceholder);

  // To be reused later
  // const AQFLevels: Array<ReactSelectOption> = [
  //   { value: 1, label: 'AQF Level 1 - Certificate I', },
  //   { value: 2, label: 'AQF Level 2 - Certificate II', },
  //   { value: 3, label: 'AQF Level 3 - Certificate III', },
  //   { value: 4, label: 'AQF Level 4 - Certificate IV', },
  //   { value: 5, label: 'AQF Level 5 - Diploma', },
  //   { value: 6, label: 'AQF Level 6 - Advanced Diploma, Associate Degree', },
  //   { value: 7, label: 'AQF Level 7 - Vocational Degree, Bachelor Degree', },
  //   { value: 8, label: 'AQF Level 8 - Bachelor Honours Degree, Graduate Certificate, Graduate Diploma', },
  //   { value: 9, label: 'AQF Level 9 - Masters Degree', },
  //   { value: 10, label: 'AQF Level 10 - Doctoral Degree', },
  // ];

  const loadOrganisations = debounce((
    inputValue: string,
    callback: (options: unknown) => void,
  ) => {
    setIsCertificationsLoading(true);
    getOrganisationsAsOptions(inputValue).then((res: Array<ReactSelectOption>) => {
      if (res.length > 0) {
        return callback(res);
      }
  });
  }, 500);

  const loadCertifications = async (option: unknown): Promise<void> => {
    setCertificationPlaceholder('Finding Certifications...');
    const options: Array<ReactSelectOption> = await getCertificationsAsOptions((option as ReactSelectOption).value as number);
    setCertificationOptions(options);
    setIsCertificationsLoading(false);

    if (options.length > 0) {
      setCertificationPlaceholder('Search for Certification');
    } else {
      setCertificationPlaceholder('No Certifications found');
      setIsCertificationsLoading(true);
    }
  };

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:mb-6">
      <Dropdown
        isAsync
        loadOptions={loadOrganisations}
        label="My Certificate IV in training and assessment was completed at"
        placeholder="Search for RTO"
        isSearchable
        onChange={loadCertifications}
      />
      <Dropdown
        options={certificationOptions}
        label="My Certificate IV in training and assessment"
        placeholder={certificationPlaceholder}
        isSearchable
        isDisabled={isCertificationsLoading}
      />
      <DatePicker label="Completed on" />
    </div>
  );
};

export default VETQualificationsForm;

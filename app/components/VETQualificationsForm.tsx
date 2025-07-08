import { getOrganisationsAsOptions, getCertificationsAsOptions } from '~/utilities/data';
import debounce from 'lodash.debounce';
import Dropdown from './Dropdown';
import { type ReactSelectOption, type VETQualificationDetails } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';

interface VETQualificationsFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, qualificationDetails: VETQualificationDetails) => void;
};

const newVETQualificationDetails: VETQualificationDetails = {
  orgID: '',
  completed: '',
  qualification: '',
};

const VETQualificationsForm: FC<VETQualificationsFormProps> = ({ onCancel, onSubmit }): JSX.Element => {
  const [certificationOptions, setCertificationOptions] = useState<Array<ReactSelectOption>>([]);
  const [isCertificationsLoading, setIsCertificationsLoading] = useState<boolean>(true);
  const [certificationPlaceholder, setCertificationPlaceholder] = useState<string>('Select an RTO to see Cerficatations');
  const [vetQualificationDetails, setVETQualificationDetails] = useState<VETQualificationDetails>(newVETQualificationDetails);
  const [errors, setErrors] = useState<VETQualificationDetails>(newVETQualificationDetails);
  const organisationName: string = 'orgID';
  const certificationName: string = 'qualification';
  const isFormValid = useRef<boolean>(false);

  const loadOrganisations = debounce((
    inputValue: string,
    callback: (options: Array<ReactSelectOption>) => void,
  ) => {
    getOrganisationsAsOptions(inputValue).then((res: Array<ReactSelectOption>) => {
      if (res.length > 0) {
        return callback(res);
      }
  });
  }, 500);

  const loadCertifications = async (option: ReactSelectOption ): Promise<void> => {
    setCertificationPlaceholder('Finding Certifications...');
    let options: Array<ReactSelectOption> = [];

    if (typeof option.value === 'string') {
      setIsCertificationsLoading(true);
      options = await getCertificationsAsOptions(option.value);
    }

    if (options.length > 0) {
      setCertificationOptions(options);
      setIsCertificationsLoading(false);
      setCertificationPlaceholder('Search for Certification');
    } else {
      setCertificationPlaceholder('No Certifications found');
      setIsCertificationsLoading(true);
    }
  };

  const handleOnChangeDropdown = (option: ReactSelectOption, name: string) => {
    if (typeof option.value === 'string') {
      setVETQualificationDetails({ ...vetQualificationDetails, [name]: option.value.toString() });
    }
  };

  const handleOnChangeOrganisation = (option: ReactSelectOption, name: string) => {
    loadCertifications(option);
    handleOnChangeDropdown(option, name);
  };

  const handleOnChangeDate = (date: string) => {
    setVETQualificationDetails({ ...vetQualificationDetails, completed: date });
  };

  const validateDropdown = (name: string) => {
    const isValid: boolean = !!vetQualificationDetails[name as keyof VETQualificationDetails];
    const VETQualificationDetailsLabels: Record<string, string> = {
      [organisationName]: 'an organisation',
      [certificationName]: 'a certification',
    };

    if (!isValid) {
      setErrors((prevErrors: VETQualificationDetails) => ({ ...prevErrors, [name]: 'Please choose ' + VETQualificationDetailsLabels[name] }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: VETQualificationDetails) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateDate = () => {
    const isValid: boolean = !!vetQualificationDetails.completed;

    if (!isValid) {
      setErrors((prevErrors: VETQualificationDetails) => ({ ...prevErrors, completed: 'Please choose a month and a year' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: VETQualificationDetails) => ({ ...prevErrors, completed: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateDropdown(organisationName);
    validateDropdown(certificationName);
    validateDate();
    onSubmit(isFormValid.current, vetQualificationDetails);
  };

  return (
    <form className="registration-form registration-form--auto tw:gap-4" onSubmit={handleSubmit} noValidate>
      <Dropdown
        isAsync
        loadOptions={loadOrganisations}
        label="My Certificate IV in training and assessment was completed at"
        name={organisationName}
        placeholder="Search for RTO"
        isSearchable
        error={errors.orgID}
        onChange={handleOnChangeOrganisation}
        onBlur={() => errors.qualification && validateDropdown(organisationName)}
      />
      <Dropdown
        options={certificationOptions}
        label="My Certificate IV in training and assessment"
        placeholder={certificationPlaceholder}
        name={certificationName}
        isSearchable
        error={errors.qualification}
        isDisabled={isCertificationsLoading}
        onChange={handleOnChangeDropdown}
        onBlur={() => errors.qualification && validateDropdown(certificationName)}
      />
      <DatePicker
        label="Completed on"
        error={errors.completed}
        onChange={handleOnChangeDate}
        onBlur={() => errors.completed && validateDate()}
      />
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default VETQualificationsForm;

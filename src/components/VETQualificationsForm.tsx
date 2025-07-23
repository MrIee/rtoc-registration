import { getOrganisationsAsOptions, getTAECoursesAsOptions } from '../utilities/data';
import { loadReactSelectOptionsAsync } from '../utilities/helpers';
import Dropdown from './Dropdown';
import { type ReactSelectOption, type VETQualificationDetails } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';
import useLoadReactSelectOptions from '../hooks/useLoadReactSelectOptions';

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
  const [vetQualificationDetails, setVETQualificationDetails] = useState<VETQualificationDetails>(newVETQualificationDetails);
  const [errors, setErrors] = useState<VETQualificationDetails>(newVETQualificationDetails);
  const organisationName: string = 'orgID';
  const certificationName: string = 'qualification';
  const isFormValid = useRef<boolean>(false);

  const loadOrganisations = loadReactSelectOptionsAsync(getOrganisationsAsOptions);
  const {
    loadOptions: loadCertifications,
    options: certificationOptions,
    isLoading: isCertificationsLoading,
    placeholder: certificationPlaceholder,
  } = useLoadReactSelectOptions('Select an RTO to see Cerficatations', 'Cerficatation', getTAECoursesAsOptions);

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
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <Dropdown
          isAsync
          loadOptions={loadOrganisations}
          label="My Certificate IV in training and assessment was completed at"
          name={organisationName}
          placeholder="Search for RTO"
          isSearchable
          error={errors.orgID}
          onChange={handleOnChangeOrganisation}
          onBlur={() => errors.orgID && validateDropdown(organisationName)}
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
      </div>
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default VETQualificationsForm;

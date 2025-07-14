import { getTaughtUnits } from '~/utilities/data';
import Dropdown from './Dropdown';
import type { ReactSelectOption, IndustryExperienceData } from '../utilities/interfaces';
import { useEffect, useRef, useState, type ChangeEvent, type FC, type FormEvent, type JSX } from 'react';
import TextInput from './TextInput';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';
import FileUpload from './FileUpload';
import { isDateRangeValid, isValidABN } from '~/utilities/helpers';

interface IndustryExperienceFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, experience: IndustryExperienceData) => void;
};

const newIndustryDetails: IndustryExperienceData = {
  companyName: '',
  ABN: '',
  positionTitle: '',
  file: null,
  fileName: '',
  started: '',
  completed: '',
  units: [],
  unitsMsg: '',
};

const IndustryExperienceForm: FC<IndustryExperienceFormProps> = ({ onCancel, onSubmit }): JSX.Element => {
  const [experience, setExperience] = useState<IndustryExperienceData>(newIndustryDetails);
  const [relatedExperienceOptions, setRelatedExperienceOptions] = useState<Array<ReactSelectOption>>([]);
  const [errors, setErrors] = useState<IndustryExperienceData>(newIndustryDetails);
  const relatedExperienceName: string = 'Related Experience';
  const isFormValid = useRef<boolean>(false);

  useEffect(() => {
    const intializeRelatedExperienceData = async () => {
      const units: Array<ReactSelectOption> = await getTaughtUnits();
      setRelatedExperienceOptions(units);
    };

    intializeRelatedExperienceData();
  }, []);

  const handleOnChangeTextInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExperience({...experience, [name]: value });
  };

  const handleOnChangeRelatedExperience = (options: Array<ReactSelectOption>) => {
    const newUnits: Array<string> = options.map((option: ReactSelectOption): string =>
      typeof option.value === 'string' ? option.value : '');

    setExperience({ ...experience, units: newUnits });
  };

  const handleOnChangeFile = (file: File) => {
    setExperience({ ...experience, file });
  };

  const handleOnChangeDate = (name: string, date: string) => {
    setExperience({ ...experience, [name]: date });
  };

  const validateTextInput = (name: string) => {
    let nameString: string = '';

    switch(name) {
      case 'companyName':
        nameString = 'a company name';
        break;
      case 'positionTitle':
        nameString = 'a position';
        break;
    }

    if (!experience[name as keyof IndustryExperienceData]) {
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, [name]: 'Please enter ' + nameString }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: ''}));
    }
  };

  const validateABN = () => {
    if (!isValidABN(experience.ABN)) {
      setErrors((prevErrors) => ({ ...prevErrors, ABN: 'Please enter a valid ABN' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, ABN: '' }));
    }
  };

  const validateFile = () => {
    const isValid: boolean = !!experience.file;

    if (!isValid) {
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, fileName: 'Please upload a document' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fileName: '' }));
    }
  };

  const validateRelatedExperience = () => {
    const isValid: boolean = experience.units.length > 0;

    if (!isValid) {
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, unitsMsg: 'Please choose units for your related experience' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, unitsMsg: '' }));
    }
  };

  const validateDate = () => {
    const isEmpty: boolean = !experience.started && !experience.completed;

    if (isEmpty) {
      const errorMsg = 'Please choose a month and a year';
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, started: errorMsg, completed: errorMsg }));
      isFormValid.current = false;
    } else if (!isDateRangeValid(experience.started, experience.completed || '')) {
      setErrors((prevErrors: IndustryExperienceData) => ({
        ...prevErrors,
        started: 'Please choose a start date that is before the finish date',
        completed: 'Please choose a finish date that is after the start date',
      }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, started: '', completed: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateTextInput('companyName');
    validateABN();
    validateTextInput('positionTitle');
    validateFile();
    validateRelatedExperience();
    validateDate();
    onSubmit(isFormValid.current, experience);
  };

  return (
    <form className="registration-form registration-form--auto tw:gap-4" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Company Name"
        name="companyName"
        error={errors.companyName}
        onChange={handleOnChangeTextInput}
        onBlur={() => errors.companyName && validateTextInput('companyName')}
      />
      <TextInput
        label="Company ABN"
        labelLink="https://abr.business.gov.au/"
        labelLinkText="Look Up"
        name="ABN"
        error={errors.ABN}
        onChange={handleOnChangeTextInput}
        onBlur={() => errors.ABN && validateABN}
      />
      <TextInput
        label="Position Title"
        name="positionTitle"
        error={errors.positionTitle}
        onChange={handleOnChangeTextInput}
        onBlur={() => errors.positionTitle && validateTextInput('positionTitle')}
      />
      <FileUpload
        label="Upload Transcript"
        error={errors.fileName}
        onChange={handleOnChangeFile}
        onBlur={() => errors.fileName && validateFile()}
      />
      <Dropdown
        options={relatedExperienceOptions}
        isMulti
        isSearchable
        label="Related Experience"
        placeholder="Select related experience"
        name={relatedExperienceName}
        error={errors.unitsMsg}
        onAddMulti={handleOnChangeRelatedExperience}
        onRemoveMulti={handleOnChangeRelatedExperience}
        onBlur={() => errors.unitsMsg && validateRelatedExperience()}
      />
      <div className="tw:flex tw:gap-4">
        <DatePicker
          label="From"
          error={errors.started}
          onChange={(date) => handleOnChangeDate('started', date)}
          onBlur={() => errors.started && validateDate()}
        />
        <DatePicker
          label="To"
          error={errors.completed || ''}
          onChange={(date) => handleOnChangeDate('completed', date)}
          onBlur={() => errors.completed && validateDate()}
        />
      </div>
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default IndustryExperienceForm;

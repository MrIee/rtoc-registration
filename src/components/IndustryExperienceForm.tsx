import { getTaughtUnits, lookupABN } from '../utilities/data';
import Dropdown from './Dropdown';
import type { ReactSelectOption, IndustryExperienceData } from '../utilities/interfaces';
import { useEffect, useRef, useState, type ChangeEvent, type FC, type FormEvent, type JSX } from 'react';
import TextInput from './TextInput';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';
import FileUpload from './FileUpload';
import { isDateRangeValid, isValidABN } from '../utilities/helpers';

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
  const [dateRequired, setDateRequired] = useState<boolean>(false);
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

    if (newUnits.length > 0) {
      setDateRequired(true);
    } else {
      setDateRequired(false);
      setErrors((prevErrors: IndustryExperienceData) => ({ ...prevErrors, started: '', completed: '' }));
    }
  };

  const handleOnChangeFile = (file: File) => {
    setExperience({ ...experience, file });
  };

  const handleOnChangeDate = (name: string, date: string) => {
    setExperience({ ...experience, [name]: date });
  };

  const handleOnChangeABN = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    handleOnChangeTextInput(event);
    const res = await lookupABN(value);

    if (res && res.CompanyName) {
      setExperience({...experience, companyName: res.CompanyName });
    }
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

    if (dateRequired) {
      validateDate();
    }

    onSubmit(isFormValid.current, experience);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <TextInput
          label="Company Name"
          name="companyName"
          error={errors.companyName}
          value={experience.companyName}
          onChange={handleOnChangeTextInput}
          onBlur={() => errors.companyName && validateTextInput('companyName')}
        />
        <TextInput
          label="Company ABN"
          labelBtnLink="https://abr.business.gov.au/"
          labelBtnText="Look Up"
          name="ABN"
          error={errors.ABN}
          onChange={handleOnChangeABN}
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
          isMulti
          options={relatedExperienceOptions}
          isSearchable
          label="Related Experience"
          placeholder="Select related experience"
          name={relatedExperienceName}
          required={false}
          error={errors.unitsMsg}
          onAddMulti={handleOnChangeRelatedExperience}
          onRemoveMulti={handleOnChangeRelatedExperience}
          onBlur={() => errors.unitsMsg && validateRelatedExperience()}
        />
        <div className="tw:flex tw:gap-4">
          <DatePicker
            label="From"
            required={dateRequired}
            error={errors.started}
            onChange={(date) => handleOnChangeDate('started', date)}
            onBlur={() => errors.started && validateDate()}
          />
          <DatePicker
            label="To"
            required={dateRequired}
            error={errors.completed || ''}
            onChange={(date) => handleOnChangeDate('completed', date)}
            onBlur={() => errors.completed && validateDate()}
          />
        </div>
      </div>
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default IndustryExperienceForm;

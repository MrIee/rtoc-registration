import { getTEProvidersAsOptions, getTECoursesAsOptions } from '../utilities/data';
import { loadReactSelectOptionsAsync } from '../utilities/helpers';
import { AQF_LEVEL_OPTIONS } from '../utilities/constants';
import Dropdown from './Dropdown';
import type { ReactSelectOption, TEQualification } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';
import FileUpload from './FileUpload';
import useLoadReactSelectOptions from '../hooks/useLoadReactSelectOptions';

interface HigherEducationFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, teQualification: TEQualification) => void;
};

const newTEDetails: TEQualification = {
  providerID: '',
  providerName: '',
  courseID: '',
  courseName: '',
  aqf: '',
  file: null,
  fileName: '',
  completed: '',
};

const HigherEducationForm: FC<HigherEducationFormProps> = ({ onCancel, onSubmit }): JSX.Element => {
  const [teQualification, setTEQualification] = useState<TEQualification>(newTEDetails);
  const [errors, setErrors] = useState<TEQualification>(newTEDetails);
  const providerName: string = 'providerName';
  const courseName: string = 'courseName';
  const aqfName: string = 'aqf';
  const isFormValid = useRef<boolean>(false);

  const loadTEProviders = loadReactSelectOptionsAsync(getTEProvidersAsOptions);
  const {
    loadOptions: loadTECourses,
    options: teCourseOptions,
    isLoading: isTECourseLoading,
    setIsLoading: setIsTECourseLoading,
    placeholder: teCoursePlaceholder,
    setPlaceholder: setTECoursePlaceholder,
  } = useLoadReactSelectOptions('Select an Institution to see Courses', 'Course', getTECoursesAsOptions);

  const handleOnChangeProvider = (option: ReactSelectOption) => {
    if (option.__isNew__ && typeof option.value === 'string') {
        setIsTECourseLoading(false);
        setTECoursePlaceholder('Enter your course');
        setTEQualification({ ...teQualification, providerID: '0', providerName: option.value });
    }

    if (
      option.value && typeof option.value === 'object' &&
      'id' in option.value && typeof option.value.id === 'number' &&
      'name' in option.value && typeof option.value.name=== 'string'
    ) {
      loadTECourses({ id: option.id, value: option.value.id.toString(), label: option.label });
      setTEQualification({ ...teQualification, providerID: option.value.id.toString(), providerName: option.value.name });
    }
  };

  const handleOnChangeCourse = (option: ReactSelectOption) => {
    if (option.__isNew__ && typeof option.value === 'string') {
        setTEQualification({ ...teQualification, courseID: '0', courseName: option.value });
    }

    if (
      option.value && typeof option.value === 'object' &&
      'id' in option.value && typeof option.value.id === 'number' &&
      'course_name' in option.value && typeof option.value.course_name=== 'string'
    ) {
      setTEQualification({ ...teQualification, courseID: option.value.id.toString(), courseName: option.value.course_name });
    }
  };

  const handleOnChangeAQF = (option: ReactSelectOption) => {
    if (typeof option.value === 'string') {
      setTEQualification({ ...teQualification, aqf: option.value });
    }
  };

  const handleOnChangeFile = (file: File) => {
    setTEQualification({ ...teQualification, file });
  };

  const handleOnChangeDate = (date: string) => {
    setTEQualification({ ...teQualification, completed: date });
  };

  const validateDropdown = (name: string) => {
    const isValid: boolean = !!teQualification[name as keyof TEQualification];
    const TEDetailsLabels: Record<string, string> = {
      [providerName]: 'an institution',
      [courseName]: 'a certification',
      [aqfName]: 'an AQF level',
    };

    if (!isValid) {
      setErrors((prevErrors: TEQualification) => ({ ...prevErrors, [name]: 'Please choose ' + TEDetailsLabels[name] }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TEQualification) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateFile = () => {
    const isValid: boolean = !!teQualification.file;

    if (!isValid) {
      setErrors((prevErrors) => ({ ...prevErrors, fileName: 'Please upload your transcript' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fileName: '' }));
    }
  };

  const validateDate = () => {
    const isValid: boolean = !!teQualification.completed;

    if (!isValid) {
      setErrors((prevErrors: TEQualification) => ({ ...prevErrors, completed: 'Please choose a month and a year' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TEQualification) => ({ ...prevErrors, completed: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateDropdown(providerName);
    validateDropdown(courseName);
    validateDropdown(aqfName);
    validateFile();
    validateDate();
    onSubmit(isFormValid.current, teQualification);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <Dropdown
          isAsync
          isCreatable
          loadOptions={loadTEProviders}
          label="Name of Australian Institution"
          placeholder="Search for Institution"
          name={providerName}
          isSearchable
          error={errors.providerName}
          onChange={handleOnChangeProvider}
          onBlur={() => errors.providerName && validateDropdown(providerName)}
          />
        <Dropdown
          isCreatable
          options={teCourseOptions}
          label="Name of Qualification"
          name={courseName}
          placeholder={teCoursePlaceholder}
          isSearchable
          isDisabled={isTECourseLoading}
          error={errors.courseName}
          onChange={handleOnChangeCourse}
          onBlur={() => errors.courseName && validateDropdown(courseName)}
        />
        <Dropdown
          options={AQF_LEVEL_OPTIONS}
          label="AQF Level"
          placeholder="Select AQF level"
          name={aqfName}
          isSearchable
          error={errors.aqf}
          onChange={handleOnChangeAQF}
          onBlur={() => errors.aqf && validateDropdown('aqf')}
        />
        <FileUpload
          label="Upload Transcript"
          error={errors.fileName}
          onChange={handleOnChangeFile}
          onBlur={() => errors.fileName && validateFile()}
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

export default HigherEducationForm;

import { getTEProvidersAsOptions, getTECoursesAsOptions } from '~/utilities/data';
import debounce from 'lodash.debounce';
import Dropdown from './Dropdown';
import type { ReactSelectOption, TEDetails } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';
import FileUpload from './FileUpload';

interface HigherEducationFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, teDetails: TEDetails) => void;
};

const newTEDetails: TEDetails = {
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
  const [teCourseOptions, setTECourseOptions] = useState<Array<ReactSelectOption>>([]);
  const [isTECourseLoading, setIsTECourseLoading] = useState<boolean>(true);
  const [teCoursePlaceholder, setTECoursePlaceholder] = useState<string>('Select an Institution to see Courses');
  const [teDetails, setTEDetails] = useState<TEDetails>(newTEDetails);
  const [errors, setErrors] = useState<TEDetails>(newTEDetails);
  const providerName: string = 'providerName';
  const courseName: string = 'courseName';
  const aqfName: string = 'aqf';
  const isFormValid = useRef<boolean>(false);

  const AQFLevelOptions: Array<ReactSelectOption> = [
    { id: '1', value: '1', label: 'AQF Level 1 - Certificate I', },
    { id: '2', value: '2', label: 'AQF Level 2 - Certificate II', },
    { id: '3', value: '3', label: 'AQF Level 3 - Certificate III', },
    { id: '4', value: '4', label: 'AQF Level 4 - Certificate IV', },
    { id: '5', value: '5', label: 'AQF Level 5 - Diploma', },
    { id: '6', value: '6', label: 'AQF Level 6 - Advanced Diploma, Associate Degree', },
    { id: '7', value: '7', label: 'AQF Level 7 - Vocational Degree, Bachelor Degree', },
    { id: '8', value: '8', label: 'AQF Level 8 - Bachelor Honours Degree, Graduate Certificate, Graduate Diploma', },
    { id: '9', value: '9', label: 'AQF Level 9 - Masters Degree', },
    { id: '0', value: '10', label: 'AQF Level 10 - Doctoral Degree', },
  ];

  const loadTEProviders = debounce((
    inputValue: string,
    callback: (options: Array<ReactSelectOption>) => void,
  ) => {
    getTEProvidersAsOptions(inputValue).then((res: Array<ReactSelectOption>) => {
      if (res.length > 0) {
        return callback(res);
      }
  });
  }, 500);

  const loadTECourses = async (option: ReactSelectOption ): Promise<void> => {
    setTECoursePlaceholder('Finding Courses...');
    let options: Array<ReactSelectOption> = [];

    if (option.value && typeof option.value === 'object' && 'id' in option.value && typeof option.value.id === 'number') {
      setIsTECourseLoading(true);
      options = await getTECoursesAsOptions(option.value.id);
    }

    if (options.length > 0) {
      setTECourseOptions(options);
      setIsTECourseLoading(false);
      setTECoursePlaceholder('Search for Courses');
    } else {
      setTECoursePlaceholder('No Courses found');
      setIsTECourseLoading(true);
    }
  };

  const handleOnChangeProvider = (option: ReactSelectOption) => {
    loadTECourses(option);

    if (
      option.value && typeof option.value === 'object' &&
      'id' in option.value && typeof option.value.id === 'number' &&
      'name' in option.value && typeof option.value.name=== 'string'
    ) {
      setTEDetails({ ...teDetails, providerID: option.value.id.toString(), providerName: option.value.name });
    }
  };

  const handleOnChangeCourse = (option: ReactSelectOption) => {
    if (
      option.value && typeof option.value === 'object' &&
      'id' in option.value && typeof option.value.id === 'number' &&
      'course_name' in option.value && typeof option.value.course_name=== 'string'
    ) {
      setTEDetails({ ...teDetails, courseID: option.value.id.toString(), courseName: option.value.course_name });
    }
  };

  const handleOnChangeAQF = (option: ReactSelectOption) => {
    if (typeof option.value === 'string') {
      setTEDetails({ ...teDetails, aqf: option.value });
    }
  };

  const handleOnChangeFile = (file: File) => {
    setTEDetails({ ...teDetails, file });
  };

  const handleOnChangeDate = (date: string) => {
    setTEDetails({ ...teDetails, completed: date });
  };

  const validateDropdown = (name: string) => {
    const isValid: boolean = !!teDetails[name as keyof TEDetails];
    const TEDetailsLabels: Record<string, string> = {
      [providerName]: 'an institution',
      [courseName]: 'a certification',
      [aqfName]: 'an AQF level',
    };

    if (!isValid) {
      setErrors((prevErrors: TEDetails) => ({ ...prevErrors, [name]: 'Please choose ' + TEDetailsLabels[name] }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TEDetails) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateFile = () => {
    const isValid: boolean = !!teDetails.file;

    if (!isValid) {
      setErrors((prevErrors) => ({ ...prevErrors, fileName: 'Please upload your transcript' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fileName: '' }));
    }
  };

  const validateDate = () => {
    const isValid: boolean = !!teDetails.completed;

    if (!isValid) {
      setErrors((prevErrors: TEDetails) => ({ ...prevErrors, completed: 'Please choose a month and a year' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TEDetails) => ({ ...prevErrors, completed: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateDropdown(providerName);
    validateDropdown(courseName);
    validateFile();
    validateDate();
    onSubmit(isFormValid.current, teDetails);
  };

  return (
    <form className="registration-form registration-form--auto tw:gap-4" onSubmit={handleSubmit} noValidate>
      <Dropdown
        isAsync
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
        options={AQFLevelOptions}
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
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default HigherEducationForm;

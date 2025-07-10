import { getOrganisationsAsOptions, getUnitsAsOptions } from '~/utilities/data';
import debounce from 'lodash.debounce';
import Dropdown from './Dropdown';
import type { ReactSelectOption, TeachingExperience } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import DatePicker from './DatePicker';
import FormAddCancelButtons from './FormAddCancelButtons';

interface TeachingExperienceFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, teachingExperience: TeachingExperience) => void;
};

const newTeachingExperience: TeachingExperience = {
  orgID: '',
  started: '',
  completed: '',
  units: [],
};

const TeachingExperienceForm: FC<TeachingExperienceFormProps> = ({ onCancel, onSubmit }): JSX.Element => {
  const [unitOptions, setUnitOptions] = useState<Array<ReactSelectOption>>([]);
  const [isUnitsLoading, setIsUnitsLoading] = useState<boolean>(true);
  const [unitsPlaceholder, setUnitsPlaceholder] = useState<string>('Select an RTO to see Cerficatations');
  const [teachingExperience, setTeachingExperience] = useState<TeachingExperience>(newTeachingExperience);
  const [errors, setErrors] = useState<TeachingExperience>(newTeachingExperience);
  const organisationName: string = 'orgID';
  const unitsName: string = 'unit';
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

  const loadUnits = async (option: ReactSelectOption ): Promise<void> => {
    setUnitsPlaceholder('Finding Units...');
    let options: Array<ReactSelectOption> = [];

    if (typeof option.value === 'string') {
      setIsUnitsLoading(true);
      options = await getUnitsAsOptions(option.value);
    }

    if (options.length > 0) {
      setUnitOptions(options);
      setIsUnitsLoading(false);
      setUnitsPlaceholder('Search for Units');
    } else {
      setUnitsPlaceholder('No Units found');
      setIsUnitsLoading(true);
    }
  };

  const handleOnChangeDropdown = (option: ReactSelectOption, name: string) => {
    if (typeof option.value === 'string') {
      setTeachingExperience({ ...teachingExperience, [name]: option.value.toString() });
    }
  };

  const handleOnChangeUnits = (options: Array<ReactSelectOption>) => {
    const newUnits: Array<string> = options.map((option: ReactSelectOption): string =>
      typeof option.value === 'string' ? option.value : '');

    setTeachingExperience({ ...teachingExperience, units: newUnits });
  };

  const handleOnChangeOrganisation = (option: ReactSelectOption, name: string) => {
    loadUnits(option);
    handleOnChangeDropdown(option, name);
  };

  const handleOnChangeDate = (name: string, date: string) => {
    setTeachingExperience({ ...teachingExperience, [name]: date });
  };

  const validateOrganisation = () => {
    const isValid: boolean = !!teachingExperience.orgID;

    if (!isValid) {
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, orgID: 'Please choose an organisation' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, orgID: '' }));
    }
  };

  const validateUnits = () => {
    const isValid: boolean = teachingExperience.units.length > 0;

    if (!isValid) {
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, units: 'Please choose units' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, units: [] }));
    }
  };

  const validateDate = () => {
    const dateStarted = new Date(teachingExperience.started);
    const dateCompleted= new Date(teachingExperience.completed);
    const isEmpty: boolean = !teachingExperience.started && !teachingExperience.completed;
    const isValid: boolean = dateCompleted > dateStarted;

    if (isEmpty) {
      const errorMsg = 'Please choose a month and a year';
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, started: errorMsg, completed: errorMsg }));
      isFormValid.current = false;
    } else if (!isValid) {
      setErrors((prevErrors: TeachingExperience) => ({
        ...prevErrors,
        started: 'Please choose a start date that is before the finish date',
        completed: 'Please choose a finish date that is after the start date',
      }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: TeachingExperience) => ({ ...prevErrors, started: '', completed: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateOrganisation();
    validateUnits();
    validateDate();
    onSubmit(isFormValid.current, teachingExperience);
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
        onBlur={() => errors.orgID && validateOrganisation()}
      />
      <Dropdown
        isMulti
        options={unitOptions}
        label="My Certificate IV in training and assessment"
        placeholder={unitsPlaceholder}
        name={unitsName}
        isSearchable
        error={typeof errors.units === 'string' && errors.units || ''}
        isDisabled={isUnitsLoading}
        onAddMulti={handleOnChangeUnits}
        onRemove={handleOnChangeUnits}
        onBlur={() => typeof errors.units === 'string' && errors.units && validateUnits()}
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
          error={errors.completed}
          onChange={(date) => handleOnChangeDate('completed', date)}
          onBlur={() => errors.completed && validateDate()}
        />
      </div>
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default TeachingExperienceForm;

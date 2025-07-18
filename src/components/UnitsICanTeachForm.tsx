import { getOrganisationsAsOptions, getUnitsAsOptions } from '../utilities/data';
import debounce from 'lodash.debounce';
import Dropdown from './Dropdown';
import { type ReactSelectOption, type UnitsICanTeachData } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import FormAddCancelButtons from './FormAddCancelButtons';

interface UnitsICanTeachFormProps {
  onCancel?: () => void;
  onSubmit: (isValid: boolean, unitsDetails: UnitsICanTeachData) => void;
};

const newUnitsDetails: UnitsICanTeachData = {
  orgID: '',
  units: [],
  unitsMsg: '',
};

const UnitsICanTeachForm: FC<UnitsICanTeachFormProps> = ({ onCancel, onSubmit }): JSX.Element => {
  const [unitOptions, setUnitOptions] = useState<Array<ReactSelectOption>>([]);
  const [isUnitOptionsLoading, setIsUnitOptionsLoading] = useState<boolean>(true);
  const [unitOptionsPlaceholder, setCertificationPlaceholder] = useState<string>('Select an RTO to see Units');
  const [unitsDetails, setUnitsDetails] = useState<UnitsICanTeachData>(newUnitsDetails);
  const [errors, setErrors] = useState<UnitsICanTeachData>(newUnitsDetails);
  const organisationName: string = 'orgID';
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
    setCertificationPlaceholder('Finding Units...');
    let options: Array<ReactSelectOption> = [];

    if (typeof option.value === 'string') {
      setIsUnitOptionsLoading(true);
      options = await getUnitsAsOptions(option.value);
    }

    if (options.length > 0) {
      setUnitOptions(options);
      setIsUnitOptionsLoading(false);
      setCertificationPlaceholder('Search for Unit');
    } else {
      setCertificationPlaceholder('No Units found');
      setIsUnitOptionsLoading(true);
    }
  };

  const handleOnChangeUnits = (options: Array<ReactSelectOption>) => {
    const newUnits: Array<string> = options.map((option: ReactSelectOption): string =>
      typeof option.value === 'string' ? option.value : '');

    setUnitsDetails({ ...unitsDetails, units: newUnits });
  };

  const handleOnChangeOrganisation = (option: ReactSelectOption) => {
    loadUnits(option);
    if (typeof option.value === 'string') {
      setUnitsDetails({ ...unitsDetails, [organisationName]: option.value.toString() });
    }
  };

  const validateOrganisation = () => {
    const isValid: boolean = !!unitsDetails.orgID;

    if (!isValid) {
      setErrors((prevErrors: UnitsICanTeachData) => ({ ...prevErrors, orgID: 'Please choose an organisation' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UnitsICanTeachData) => ({ ...prevErrors, orgID: '' }));
    }
  };

  const validateUnits = () => {
    const isValid: boolean = unitsDetails.units.length > 0;

    if (!isValid) {
      setErrors((prevErrors: UnitsICanTeachData) => ({ ...prevErrors, unitsMsg: 'Please choose units' }));
      isFormValid.current = false;
    } else {
      setErrors((prevErrors: UnitsICanTeachData) => ({ ...prevErrors, unitsMsg: '' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    isFormValid.current = true;
    validateOrganisation();
    validateUnits();
    onSubmit(isFormValid.current, unitsDetails);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <div className="scroll-container">
        <Dropdown
          isAsync
          loadOptions={loadOrganisations}
          label="RTO Provider"
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
          label="I can teach these units"
          placeholder={unitOptionsPlaceholder}
          name="unitsMsg"
          isSearchable
          error={errors.unitsMsg}
          isDisabled={isUnitOptionsLoading}
          onAddMulti={handleOnChangeUnits}
          onRemoveMulti={handleOnChangeUnits}
          onBlur={() => errors.unitsMsg && validateUnits()}
        />
      </div>
      <FormAddCancelButtons onCancel={onCancel} />
    </form>
  );
};

export default UnitsICanTeachForm;

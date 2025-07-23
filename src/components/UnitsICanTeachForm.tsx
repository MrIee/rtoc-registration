import { getOrganisationsAsOptions, getUnitsFromOrgAsOptions } from '../utilities/data';
import { loadReactSelectOptionsAsync } from '../utilities/helpers';
import Dropdown from './Dropdown';
import { type ReactSelectOption, type UnitsICanTeachData } from '../utilities/interfaces';
import { useRef, useState, type FC, type FormEvent, type JSX } from 'react';
import FormAddCancelButtons from './FormAddCancelButtons';
import useLoadReactSelectOptions from '../hooks/useLoadReactSelectOptions';

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
  const [unitsDetails, setUnitsDetails] = useState<UnitsICanTeachData>(newUnitsDetails);
  const [errors, setErrors] = useState<UnitsICanTeachData>(newUnitsDetails);
  const organisationName: string = 'orgID';
  const isFormValid = useRef<boolean>(false);

  const loadOrganisations = loadReactSelectOptionsAsync(getOrganisationsAsOptions);
  const {
    loadOptions: loadUnits,
    options: unitOptions,
    isLoading: isUnitsLoading,
    placeholder: unitsPlaceholder,
  } = useLoadReactSelectOptions('Select an RTO to see Units', 'Unit', getUnitsFromOrgAsOptions);

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
          placeholder={unitsPlaceholder}
          name="unitsMsg"
          isSearchable
          error={errors.unitsMsg}
          isDisabled={isUnitsLoading}
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

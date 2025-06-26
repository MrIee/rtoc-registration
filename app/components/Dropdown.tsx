import classNames from 'classnames';
import crossIcon from '../assets/images/icon-cross.svg';
import { useId, useState } from 'react';
import Select, {
  type OptionsOrGroups,
  type GroupBase,
  type CSSObjectWithLabel,
  type StylesConfig,
  type Theme,
  type IndicatorsContainerProps,
  components,
} from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect  from 'react-select/async-creatable';
import type { ReactSelectOption } from '~/utilities/interfaces';

interface DropdownProps {
  className?: string;
  label?: string;
  placeholder?: string;
  name?: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  onChange?: (option: ReactSelectOption | unknown) => void;
  required?: boolean;
  isAsync?: boolean;
  isCreatable?: boolean;
  options?: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
  loadOptions?: ((inputValue: string, callback: (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void) => void | Promise<OptionsOrGroups<unknown, GroupBase<unknown>>>) | undefined;
};

const IndicatorsContainer = ( props: IndicatorsContainerProps, isDisabled?: boolean ) => {
  if (isDisabled) {
    return null;
  }
  return ( <components.IndicatorsContainer {...props} /> );
};


/**
 * A Dropdown component built around the react-select library. Defaults to using selected option(s) as the input value.
 *
 * **Default Select** - If neither **isAsync** or **isCreatable** is true, then \<Select /> component is rendered, which is the default react-select component
 *
 * @param isAsync If true then \<AsyncSelect /> component is rendered, which can load data from an api.
 * @param isCreatable If true then \<AsyncCreatableSelect /> component is rendered, which enables any typed input to be used as the value.
 * @param loadOptions Use this for the options when **isAsync** or is **Creatable** are true. Expects a callback with format
 *
 * ```(inputValue: string, callback: (options: ColourOption[]) => void) => { ... }```
 * @param options Use this if **isAsync** and **isCreatable** are both false.
 *
 * Expects an array of options ```[value: 1, label: "a", ...]```
 *
 */

const Dropdown = ({
  className,
  label,
  placeholder,
  name,
  isSearchable = false,
  isDisabled = false,
  isMulti = false,
  onChange,
  required = true,
  isAsync = false,
  isCreatable = false,
  options,
  loadOptions
}: DropdownProps) => {
  const [value, setValue] = useState<Array<ReactSelectOption> | ReactSelectOption | unknown>();
  const inputId: string = 'react-select-' + useId();

  const selectStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      '&:hover': {
        boxShadowColor: 'none',
      },
      padding: 5,
      borderRadius: 8,
      borderColor: state.isFocused ? 'black' : undefined,
      boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
      backgroundColor: 'rgba(0,0,0,0)',
      cursor: isSearchable ? 'text' : 'pointer',
    }),
    option: (base: CSSObjectWithLabel) => ({
      ...base,
      cursor: 'pointer',
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      borderRadius: 6,
      backgroundColor: 'oklch(96.7% 0.003 264.542)',
    }),
    indicatorsContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      cursor: 'pointer',
    }),
  }

  const selectTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'rgba(240, 230, 248, 1)', // Menu Option hover colour
    },
  });

  const handleOnChange = (option: unknown) => {
    setValue(option);
    onChange && onChange(option);
  };

  const handleRemoveOption = (optionToRemove: ReactSelectOption) => {
    const newOptions: Array<ReactSelectOption> =
      (value as Array<ReactSelectOption>).filter((option: ReactSelectOption) => option.value !== optionToRemove.value);

    setValue(newOptions);
  };

  const selectProps = {
    inputId,
    options,
    className: "tw:bg-gray-100",
    styles: selectStyles,
    theme: selectTheme,
    components: {
      IndicatorsContainer: (props: IndicatorsContainerProps) => IndicatorsContainer(props, isDisabled),
      IndicatorSeparator: () => null
    },
    value,
    placeholder,
    required,
    name,
    isMulti,
    hideSelectedOptions: !isMulti,
    controlShouldRenderValue: !isMulti,
    isClearable: true,
    isSearchable: isSearchable,
    noOptionsMessage: () => 'Start typing to search',
    onChange: handleOnChange,
    isDisabled: isDisabled,
  };

  const asyncSelectProps = {
    ...selectProps,
    loadOptions,
    components: { IndicatorsContainer: () => null, IndicatorSeparator: () => null },
  };

  const asyncCreatableProps = {
    ...selectProps,
    loadOptions,
    allowCreateWhileLoading: true,
    formatCreateLabel: (value: string) => 'Use ' + value,
    components: { DropdownIndicator: () => null, IndicatorSeparator: () => null },
  };

  const SelectComponent = () => {
    if (isAsync) {
      return <AsyncSelect {...asyncSelectProps} />;
    } else if (isCreatable) {
      return <AsyncCreatableSelect createOptionPosition='first' { ...asyncCreatableProps } />;
    } else {
      return <Select {...selectProps} />;
    }
  };

  const OptionList = () => {
    if (isMulti && value) {
      return (
        <div className="tw:flex tw:flex-col">
          {
            (value as Array<ReactSelectOption>).map((option: ReactSelectOption) => (
              <div key={option.value} className="tw:flex tw:justify-between tw:mb-2.5">
                <span>{option.label}</span>
                <img className="tw:cursor-pointer" src={crossIcon} alt="Delete option" onClick={() => handleRemoveOption(option)} />
              </div>
            ))
          }
        </div>
      );
    }

    return null;
  }

  return (
    <div>
      <label htmlFor={inputId} className={className}>
        { label && (
          <span>
            {label}
            { required && (<span>*</span>)}
          </span>
        )}
      </label>
      <div className={classNames({'tw:p-4': isMulti, 'tw:rounded-lg': isMulti, 'tw:bg-gray-100': isMulti})}>
        { <OptionList /> }
        { <SelectComponent /> }
      </div>
    </div>
  );
};

export default Dropdown;

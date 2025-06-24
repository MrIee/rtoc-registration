import { useState, type ReactNode } from 'react';
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
  inputId?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  name?: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
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

const Dropdown = ({
  inputId,
  className,
  label,
  placeholder,
  name,
  isSearchable = false,
  isDisabled = false,
  onChange,
  required = true,
  isAsync = false,
  isCreatable = false,
  options,
  loadOptions
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<unknown>();

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
    setSelectedOption(option);
    onChange && onChange(option);
  };

  const selectProps = {
    options,
    inputId,
    className: "tw:bg-gray-100",
    styles: selectStyles,
    theme: selectTheme,
    components: {
      IndicatorsContainer: (props: IndicatorsContainerProps) => IndicatorsContainer(props, isDisabled),
      IndicatorSeparator: () => null
    },
    value: selectedOption,
    placeholder,
    required,
    name,
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
      console.log('async!');
      return (
        <AsyncSelect {...asyncSelectProps} />
      );
    } else if (isCreatable) {
      console.log('creatable!');
      return ( <AsyncCreatableSelect createOptionPosition='first' { ...asyncCreatableProps } /> );
    } else {
      console.log('select!');
      return ( <Select {...selectProps} /> );
    }
  };

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
      { SelectComponent() }
      {/* { isAsync ? (
        <AsyncSelect {...asyncSelectProps} />
      ) : (
        <Select {...selectProps} />
      )} */}
    </div>
  );
};

export default Dropdown;

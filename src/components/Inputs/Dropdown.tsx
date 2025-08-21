import classNames from 'classnames';
import crossIcon from '../../assets/images/icon-cross.svg';
import { useEffect, useId, useState, type ReactNode } from 'react';
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
import CreatableSelect  from 'react-select/creatable';
import type { DropdownStyle, InputPropsNoEvents, ReactSelectOption } from '../../utilities/interfaces';

interface DropdownProps extends Omit<InputPropsNoEvents, 'defaultValue'> {
  className?: string;
  hasBorder?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  defaultValue?: ReactSelectOption | Array<ReactSelectOption> | null;
  onChange?: (option: ReactSelectOption, name: string) => void;
  onAddMulti?: (options: Array<ReactSelectOption>, name: string) => void;
  onRemoveMulti?: (options: Array<ReactSelectOption>, name: string) => void;
  onBlur?: () => void;
  isAsync?: boolean;
  isMulti?: boolean;
  isCreatable?: boolean;
  options?: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
  loadOptions?: (
    inputValue: string,
    callback: (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
  ) => void | Promise<OptionsOrGroups<unknown, GroupBase<unknown>>>;
  showErrorText?: boolean;
  multiLimit?: number;
  overrideNewOption?: boolean;
  style?: DropdownStyle;
  dropdownValue?: Array<ReactSelectOption> | ReactSelectOption | unknown;
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
 * @param {boolean} isAsync If true then \<AsyncSelect /> component is rendered, which can load data from an api.
 * @param {boolean} isCreatable If true then \<CreatableSelect /> component is rendered, which enables any typed input to be used as the value.
 *
 * If both isAsync and isCreatable are true, then <AsyncCreatableSelect /> component is rendered.
 * @param {Promise} loadOptions Use this for the options when **isAsync** or **isCreatable** are true. Expects a callback with format
 *
 * ```(inputValue: string, callback: (options: ColourOption[]) => void) => { ... }```
 * @param {Array<ReactSelectOption>} options Use this if **isAsync** and **isCreatable** are both false.
 *
 * Expects an array of options ```[value: 1, label: "a", ...]```
 *
 */

const Dropdown = ({
  className,
  label,
  placeholder,
  name,
  defaultValue,
  isSearchable = false,
  isDisabled = false,
  isMulti = false,
  onChange,
  onAddMulti,
  onRemoveMulti,
  onBlur,
  required = true,
  isAsync = false,
  isCreatable = false,
  options,
  loadOptions,
  error,
  showErrorText = true,
  hasBorder = false,
  isSlim = false,
  multiLimit,
  overrideNewOption = false,
  style,
  dropdownValue,
}: DropdownProps) => {
  const [value, setValue] = useState<Array<ReactSelectOption> | ReactSelectOption | unknown>();
  const [errorMsg, setErrorMsg] = useState<string>(error || '');
  const inputId: string = 'react-select-' + useId();

  useEffect(() => {
    setValue(dropdownValue);
  }, [dropdownValue]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setErrorMsg(error || '');
  }, [error]);

  const getBoxShadowStyle = (isFocused: boolean): string => {
    if (error) {
      return '0 0 0 2px red';
    } else if (isFocused) {
      return '0 0 0 2px rgb(93, 55, 113)';
    } else {
      if (isMulti) {
        return '0 0 0 2px lightgray';
      }
      return 'none';
    }
  };

  const selectStyles: StylesConfig = {
    control: (base: CSSObjectWithLabel, state) => ({
      ...base,
      ...style?.control,
      '&:hover': {
        boxShadowColor: 'none',
      },
      minHeight: isSlim ? 32 : 38,
      padding: isSlim ? 0 : 6,
      borderWidth: hasBorder ? 1 : 0,
      borderColor: 'oklch(87.2% 0.01 258.338)',
      borderRadius: 8,
      boxShadow: getBoxShadowStyle(state.isFocused),
      backgroundColor: 'rgba(0,0,0,0)',
      cursor: isSearchable ? 'text' : 'pointer',
    }),
    option: (base: CSSObjectWithLabel) => ({
      ...base,
      ...style?.option,
      cursor: 'pointer',
      paddingBlock: isSlim ? 5 : 8,
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      ...style?.menu,
      zIndex: 99,
      borderRadius: 6,
      backgroundColor: 'oklch(96.7% 0.003 264.542)',
    }),
    indicatorsContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      ...style?.indicatorsContainer,
      cursor: 'pointer',
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
      ...base,
      ...style?.dropdownIndicator,
      paddingInline: 2,
      padding: isSlim ? 5 : 8,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      ...style?.singleValue,
    }),
  };

  const selectTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'rgba(240, 230, 248, 1)', // Menu Option hover colour
    },
  });

  const handleOnChange = (option: ReactSelectOption | Array<ReactSelectOption> | unknown) => {
    if (typeof option === 'object' && Object.hasOwn(option || {}, 'length')) {
      const options = option as Array<ReactSelectOption>;

      if (overrideNewOption) {
        let index = -1;
        let numNew = 0;
        options.forEach((option: ReactSelectOption, i: number) => {
          numNew = option.__isNew__ ? numNew + 1 : numNew;

          if (numNew === 1) {
            index = i;
          }
        });

        if (numNew > 1 && index > -1) {
          options.splice(index, 1);
        }
      }

      if (multiLimit && options.length > multiLimit) {
        options.pop();
        setErrorMsg(`You may only have up to ${multiLimit} items selected`);
      }

      onAddMulti?.(options, name || '');
    } else {
      onChange?.(option as ReactSelectOption, name || '');
    }

    setValue(option);
  };

  const handleRemoveOption = (optionToRemove: ReactSelectOption) => {
    const newOptions: Array<ReactSelectOption> =
      (value as Array<ReactSelectOption>).filter((option: ReactSelectOption) => option.value !== optionToRemove.value);

    setValue(newOptions);
    onRemoveMulti?.(newOptions, name || '');
    setErrorMsg('');
  };

  const selectProps = {
    inputId,
    options,
    className: 'tw:bg-gray-100 tw:rounded-lg',
    styles: selectStyles,
    theme: selectTheme,
    components: {
      IndicatorsContainer: (props: IndicatorsContainerProps) => IndicatorsContainer(props, isDisabled),
      IndicatorSeparator: () => null
    },
    value,
    defaultValue,
    placeholder,
    required,
    isMulti,
    isClearable: false,
    hideSelectedOptions: isMulti,
    controlShouldRenderValue: !isMulti,
    isSearchable,
    noOptionsMessage: () => 'Start typing to search',
    onChange: handleOnChange,
    onBlur,
    isDisabled: isDisabled,
  };

  const asyncSelectProps = {
    ...selectProps,
    loadOptions,
    components: { IndicatorsContainer: () => null, IndicatorSeparator: () => null },
  };

  const creatableProps = {
    ...selectProps,
    allowCreateWhileLoading: true,
    formatCreateLabel: (value: string) => 'Use ' + value,
    components: { DropdownIndicator: () => null, IndicatorSeparator: () => null },
  };

  const asyncCreatableProps = {
    ...selectProps,
    ...creatableProps,
    loadOptions,
  };

  const SelectComponent = () => {
    if (isCreatable) {
      if (isAsync) {
        return <AsyncCreatableSelect createOptionPosition='first' { ...asyncCreatableProps } />;
      } else {
        return <CreatableSelect createOptionPosition='first' { ...creatableProps } />;
      }
    } else if (isAsync) {
      return <AsyncSelect {...asyncSelectProps} />;
    } else {
      return <Select {...selectProps} />;
    }
  };

  const optionList: ReactNode = isMulti && value ? (
    <div className="tw:flex tw:flex-col">
      {
        (value as Array<ReactSelectOption>).map((option: ReactSelectOption, i: number) => (
          <div key={option.id || i} className="tw:flex tw:justify-between tw:mb-2.5">
            <span>{option.label}</span>
            <img className="tw:cursor-pointer" src={crossIcon} alt="Delete option" onClick={() => handleRemoveOption(option)} />
          </div>
        ))
      }
    </div>
  ) : null;

  return (
    <div className={classNames('tw:flex tw:flex-col', className)}>
      <label className="tw:inline-flex" htmlFor={inputId}>
        { label && (
          <span className="label__text">
            {label}
            { required && (<span>*</span>)}
          </span>
        )}
      </label>
      <div className={classNames({'tw:p-4 tw:rounded-lg tw:bg-gray-100': isMulti && !isSlim})}>
        { optionList }
        { <SelectComponent /> }
      </div>
      { errorMsg && showErrorText && <span className="tw:text-sm tw:text-red-500">{errorMsg}</span> }
    </div>
  );
};

export default Dropdown;

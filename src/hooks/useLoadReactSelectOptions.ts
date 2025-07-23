import { useState } from 'react';
import type { ReactSelectOption } from '../utilities/interfaces';

/**
 * A custom hook to load React Select options
 * @param placeholderString Initial placeholder string
 * @param loadDataString The type of data to be loaded as a string to be displayed in the placeholder messages.
 * @param callback An asynchronous function that will fetch the data to be loaded into state.
 *
 * callback function should look like (id: string) => Array<ReactSelectOption>
 */

const useLoadReactSelectOptions = (
  placeholderString: string,
  loadDataString: string,
  callback: (id: string) => Promise<Array<ReactSelectOption>>,
) => {
  const [options, setOptions] = useState<Array<ReactSelectOption>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [placeholder, setPlaceholder] = useState<string>(placeholderString);

  const loadOptions = async (option: ReactSelectOption ): Promise<void> => {
    setPlaceholder(`Finding ${loadDataString}s...`);
    let options: Array<ReactSelectOption> = [];

    if (typeof option.value === 'string') {
      setIsLoading(true);
      options = await callback(option.value);
    }

    if (options.length > 0) {
      setOptions(options);
      setIsLoading(false);
      setPlaceholder(`Search for ${loadDataString}s`);
    } else {
      setPlaceholder(`No ${loadDataString}s found`);
      setIsLoading(true);
    }
  };

  return { loadOptions, options, isLoading, setIsLoading, placeholder, setPlaceholder };
};

export default useLoadReactSelectOptions;

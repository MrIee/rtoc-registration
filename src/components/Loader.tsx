import { useState, type FC, type JSX } from 'react';

interface LoaderProps {
  loading?: boolean;
  typeToBeLoaded: string;

};

const Loader: FC<LoaderProps> = ({ loading = true, typeToBeLoaded }): JSX.Element => {
  const [isLoading] = useState<boolean>(loading);

  return (
    <>
      { isLoading &&
        <div className="tw:text-2xl tw:mx-auto tw:absolute tw:transform tw:-translate-y-1/2 tw:top-1/2">
          Loading{typeToBeLoaded ? ' ' + typeToBeLoaded : ''}...
        </div>
      }
    </>
  );
};

export default Loader;

import { useState, type ReactNode } from "react";
import Select from 'react-select';

interface AddDetailsModalProps {
  title: string;
  children: ReactNode;
};

const AddDetailsModal = ({ title, children }: AddDetailsModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
      <span className="tw:cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
        {children}
      </span>
      {isVisible ? (
        <>
          <div
            className="tw:h-full tw:w-full tw:bg-black/40 tw:fixed tw:top-0 tw:right-0 tw:bottom-0 tw:left-0"
            onClick={() => setIsVisible(false)}
          >
          </div>
          <div className="tw:lg:w-[640px] tw:w-full tw:p-8 tw:mx-auto tw:rounded-xl tw:bg-white tw:absolute tw:top-1/5 tw:left-0 tw:right-0 tw:z-10">
            <h3 className="tw:mb-8 tw:text-2xl tw:text-rtoc-purple-500 tw:font-semibold tw:text-center">{title}</h3>
            <div className="tw:flex tw:justify-end">
              <button className="btn btn--secondary tw:mr-6" onClick={() => setIsVisible(false)}>Cancel</button>
              <button className="btn">Add</button>
            </div>
          </div>
        </>
      ) : (
        null
      )}
    </>
  );
};

export default AddDetailsModal;

import { useEffect, useState, type ReactNode } from 'react';

interface AddDetailsModalProps {
  title: string;
  showModal: boolean;
  onClose: (isVisible: boolean) => void;
  children: ReactNode;
};

const AddDetailsModal = ({ title, showModal = false, onClose, children }: AddDetailsModalProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(showModal);
  }, [showModal]);

  const closeModal = () => {
    setIsVisible(false);
    onClose(false);
  };

  return (
    <>
      {isVisible ? (
        <>
          <div
            className="tw:h-full tw:w-full tw:bg-black/40 tw:fixed tw:top-0 tw:right-0 tw:bottom-0 tw:left-0"
            onClick={closeModal}
          >
          </div>
          <div className="tw:lg:h-auto tw:h-full tw:lg:w-[640px] tw:w-full tw:flex tw:flex-col tw:p-8 tw:mx-auto tw:lg:rounded-xl tw:bg-white tw:absolute tw:lg:top-1/5 tw:top-0 tw:left-0 tw:right-0 tw:z-10">
            <h3 className="tw:mb-8 tw:text-2xl tw:text-rtoc-purple-500 tw:font-semibold tw:text-center">{title}</h3>
            {children}
            <div className="tw:flex tw:justify-end tw:mt-auto">
              <button className="btn btn--secondary tw:mr-6" onClick={closeModal}>Cancel</button>
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

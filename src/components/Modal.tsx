import crossIcon from '../assets/images/icon-cross.svg';
import { useEffect, useState, type ReactNode, type MouseEvent, } from 'react';

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

    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  const closeModal = () => {
    setIsVisible(false);
    onClose(false);

    document.body.style.overflow = 'auto';
  };

  const handleOnClickModal = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <>
      {isVisible ? (
        <>
          <div
            className="tw:h-full tw:w-full tw:bg-black/40 tw:fixed tw:top-0 tw:right-0 tw:bottom-0 tw:left-0 tw:z-50"
            onClick={closeModal}
          >
            <div
              className="tw:lg:h-auto tw:h-full tw:lg:w-[640px] tw:lg:max-h-3/4 tw:w-full tw:flex tw:flex-col tw:p-6 tw:mx-auto tw:lg:rounded-xl tw:bg-white tw:fixed tw:lg:top-1/6 tw:top-0 tw:left-0 tw:right-0 tw:z-10"
              onClick={handleOnClickModal}
            >
              <img className="tw:w-3 tw:cursor-pointer tw:absolute tw:top-4 tw:right-4" src={crossIcon} onClick={closeModal} />
              <h3 className="tw:mb-6 tw:text-2xl tw:text-rtoc-purple-500 tw:font-semibold tw:text-center">{title}</h3>
              <div className="tw:lg:max-h-[720px] tw:lg:h-auto tw:h-full tw:overflow-y-auto">
                {children}
              </div>
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

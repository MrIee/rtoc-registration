// import iconEdit from '../assets/images/icon-edit.svg';
// import iconDelete from '../assets/images/icon-delete.svg';
import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import HigherEducationForm from './HigherEducationForm';
import FormButtons from './FormButtons';
import { type TEDetails } from '~/utilities/interfaces';

interface HigherEducationProps {
  teDetails?: Array<TEDetails>;
  onSubmit: (isValid: boolean, teDetails: TEDetails) => void;
};

const HigherEducationContainer: FC<HigherEducationProps> = ({ onSubmit }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSubmit = (isValid: boolean, teDetails: TEDetails) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, teDetails);
    }
  };

  return (
    <div className="registration-form">
      <AddDetailsButton label="Higher Education" onClick={() => setIsModalVisible(true)} />
      <Modal title="Add Higher Education" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
        <HigherEducationForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
      </Modal>
      <FormButtons classes="tw:mt-auto" enableForwardNav />
    </div>
  );
};

export default HigherEducationContainer;

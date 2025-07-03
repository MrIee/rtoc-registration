import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import VETQualificationsForm from './VETQualificationsForm';
import FormButtons from "./FormButtons";
import type { VETQualificationDetails } from '~/utilities/interfaces';

interface VETQualificationsProps {
  onSubmit: (isValid: boolean, qualificationDetails: VETQualificationDetails) => void;
};

const VETQualifications: FC<VETQualificationsProps> = ({ onSubmit }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handleSubmit = (isValid: boolean, qualificationDetails: VETQualificationDetails) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, qualificationDetails);
    }
  };

  return (
    <div className="registration-form">
      <AddDetailsButton label="Add VET Qualifications" onClick={() => setIsModalVisible(true)} />
      <Modal title="Add Qualifications" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
        <VETQualificationsForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
      </Modal>
      <FormButtons classes="tw:mt-auto" enableForwardNav />
    </div>
  );
};

export default VETQualifications;

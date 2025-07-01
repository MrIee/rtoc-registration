import plusIcon from '../assets/images/icon-plus.svg';
import { useState, type FC, type JSX } from 'react';
import Modal from './Modal';
import VETQualificationsForm from './VETQualificationsForm';
import FormButtons from "./FormButtons";

const VETQualifications: FC = (): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <div className="registration-form">
      <button className="btn btn--hollow tw:flex tw:ml-auto" onClick={() => setIsModalVisible(true)}>
        <img className="tw:mr-1.5" src={plusIcon} alt="plus icon" />
        Add VET Qualifications
      </button>
      <Modal title="Add Qualifications" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
        <VETQualificationsForm />
      </Modal>
      <FormButtons classes="tw:mt-auto"  />
    </div>
  );
};

export default VETQualifications;

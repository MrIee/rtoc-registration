import iconEdit from '../assets/images/icon-edit.svg';
import iconDelete from '../assets/images/icon-delete.svg';
import { useState, type FC, type JSX, type ReactNode } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import VETQualificationsForm from './VETQualificationsForm';
import FormButtons from './FormButtons';
import { type VETQualificationDetails } from '~/utilities/interfaces';

interface VETQualificationsProps {
  qualifications: Array<VETQualificationDetails>;
  onSubmit: (isValid: boolean, qualificationDetails: VETQualificationDetails) => void;
  onDelete: (id: number) => void,
};

const VETQualifications: FC<VETQualificationsProps> = ({ qualifications = [], onSubmit, onDelete }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSubmit = (isValid: boolean, qualificationDetails: VETQualificationDetails) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, qualificationDetails);
    }
  };

  const handleDelete = (id: number | undefined) => {
    if (id) {
      onDelete(id);
    }
  };

  const qualificationsList: ReactNode = qualifications.map((qualification: VETQualificationDetails) =>
    <div key={qualification.rowID} className="tw:flex tw:justify-between tw:py-4 tw:[&:not(:first-child)]:border-t tw:border-t-rtoc-purple-500">
      <div className="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm">
        <strong className="tw:text-black tw:text-xl tw:font-semibold">{ qualification.orgName }</strong>
        <span>{ qualification.title }</span>
        <span>{ qualification.completed }</span>
      </div>
      <div className="tw:h-4 tw:flex tw:gap-2">
        <img className="tw:cursor-pointer" src={iconDelete} alt="delete" onClick={() => handleDelete(qualification.rowID)} />
      </div>
    </div>
  );

  return (
    <div className="registration-form">
      <AddDetailsButton label="Add VET Qualifications" onClick={() => setIsModalVisible(true)} />
      <Modal title="Add Qualifications" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
        <VETQualificationsForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
      </Modal>
      { qualifications.length > 0 &&
        <div className="tw:p-8 tw:my-4 tw:rounded-xl tw:border-2 tw:border-rtoc-purple-500">
          <h3>VET Qualifications</h3>
          <div>
            { qualificationsList }
          </div>
        </div>
      }
      <FormButtons classes="tw:mt-auto" enableForwardNav />
    </div>
  );
};

export default VETQualifications;

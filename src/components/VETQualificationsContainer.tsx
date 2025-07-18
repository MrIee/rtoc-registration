import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import VETQualificationsForm from './VETQualificationsForm';
import List from './List';
import type { ListItem, VETQualificationDetails } from '../utilities/interfaces';

interface VETQualificationsProps {
  qualifications: Array<VETQualificationDetails>;
  onSubmit: (isValid: boolean, qualificationDetails: VETQualificationDetails) => void;
  onDelete: (id: number) => void,
};

const VETQualifications: FC<VETQualificationsProps> = ({ qualifications = [], onSubmit, onDelete }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const listItems: Array<ListItem> = qualifications.map((qualification: VETQualificationDetails): ListItem => ({
    id: qualification.rowID || 0,
    title: qualification.OrgName || '',
    list: [qualification.title || '', qualification.completed],
  }));

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


  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:mb-4">
      <List title="VET Qualifications" items={listItems} onDelete={handleDelete}>
        <AddDetailsButton classes="tw:ml-auto" label="Add VET Qualifications" onClick={() => setIsModalVisible(true)} />
        <Modal title="Add Qualifications" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
          <VETQualificationsForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
        </Modal>
      </List>
    </div>
  );
};

export default VETQualifications;

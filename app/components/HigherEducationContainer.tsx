import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import HigherEducationForm from './HigherEducationForm';
import FormButtons from './FormButtons';
import List from './List';
import { type ListItem, type TEQualification } from '~/utilities/interfaces';
import { getAQFString } from '~/utilities/helpers';

interface HigherEducationProps {
  qualifications: Array<TEQualification>;
  onSubmit: (isValid: boolean, teQualification: TEQualification) => void;
  onDelete: (id: number) => void,
};

const HigherEducationContainer: FC<HigherEducationProps> = ({ qualifications = [], onSubmit, onDelete }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const listItems: Array<ListItem> = qualifications.map((qualification: TEQualification): ListItem => ({
      id: qualification.rowID || 0,
      title: qualification.courseName || '',
      list: [qualification.providerName, getAQFString(qualification.aqf.toString()), qualification.completed],
      fileName: qualification.fileName,
    }));

  const handleSubmit = (isValid: boolean, teQualification: TEQualification) => {
    if (isValid) {
      setIsModalVisible(false);
      onSubmit(isValid, teQualification);
    }
  };

   const handleDelete = (id: number | undefined) => {
    if (id) {
      onDelete(id);
    }
  };

  return (
    <div className="registration-form">
      <List title="VET Qualifications" items={listItems} onDelete={handleDelete}>
        <AddDetailsButton classes="tw:ml-auto" label="Higher Education" onClick={() => setIsModalVisible(true)} />
        <Modal title="Add Higher Education" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
          <HigherEducationForm onSubmit={handleSubmit} onCancel={() => setIsModalVisible(false)} />
        </Modal>
      </List>
      <FormButtons classes="tw:mt-auto" enableForwardNav />
    </div>
  );
};

export default HigherEducationContainer;

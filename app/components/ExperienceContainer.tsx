// import iconDelete from '../assets/images/icon-delete.svg';
import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import TeachingExperienceForm from './TeachingExperienceForm';
import FormButtons from './FormButtons';
import List from './List';
import { type ListItem, type TeachingExperience, type Unit } from '~/utilities/interfaces';

interface ExperienceProps {
  teachingExperience: Array<TeachingExperience>;
  onSubmitTE: (isValid: boolean, teachingExperience: TeachingExperience) => void;
  onDeleteTE: (id: number) => void;
};

const ExperienceContainer: FC<ExperienceProps> = ({ teachingExperience, onSubmitTE, onDeleteTE }): JSX.Element => {
  const [isTEModalVisible, setIsTEModalVisible] = useState<boolean>(false);

  const getPoints = (units: Array<Unit>): Array<string> => units.map((unit: Unit) => `${unit.code} ${unit.title}`);

  const listItems: Array<ListItem> = teachingExperience.map((te: TeachingExperience): ListItem => ({
    id: 0,
    title: te.orgName || '',
    list: [`${te.started} - ${te.completed}`],
    points: getPoints(te.units as Array<Unit>),
  }));

  const handleSubmitTeachingExperience = (isValid: boolean, teachingExperience: TeachingExperience) => {
    if (isValid) {
      setIsTEModalVisible(false);
      onSubmitTE(isValid, teachingExperience);
    }
  };

  const handleDeleteTE = (id: number | undefined) => {
    if (id) {
      onDeleteTE(id);
    }
  };

  return (
    <div className="registration-form">
      <List title="Teaching Experience" items={listItems} onDelete={handleDeleteTE}>
        <AddDetailsButton classes="tw:ml-auto" label="Add Teaching Experience" onClick={() => setIsTEModalVisible(true)} />
        <Modal title="Add Teaching Experience" showModal={isTEModalVisible} onClose={(isVisible) => setIsTEModalVisible(isVisible)}>
          <TeachingExperienceForm onSubmit={handleSubmitTeachingExperience} onCancel={() => setIsTEModalVisible(false)} />
        </Modal>
      </List>
      <FormButtons classes="tw:mt-auto" enableForwardNav />
    </div>
  );
};

export default ExperienceContainer;

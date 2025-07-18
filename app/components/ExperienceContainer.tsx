// import iconDelete from '../assets/images/icon-delete.svg';
import { useState, type FC, type JSX } from 'react';
import AddDetailsButton from './AddDetailsButton';
import Modal from './Modal';
import TeachingExperienceForm from './TeachingExperienceForm';
import IndustryExperienceForm from './IndustryExperienceForm';
import UnitsICanTeachForm from './UnitsICanTeachForm';
import List from './List';
import type {
  ListItem,
  TeachingExperienceData,
  TeachingExperience,
  IndustryExperienceData,
  IndustryExperience,
  UnitsICanTeach,
  UnitsICanTeachData,
  Unit,
  Point,
} from '~/utilities/interfaces';

interface ExperienceProps {
  teachingExperience: Array<TeachingExperience>;
  industryExperience: Array<IndustryExperience>;
  unitsICanTeach: Array<UnitsICanTeach>;
  onSubmitTE: (isValid: boolean, teachingExperience: TeachingExperienceData) => void;
  onSubmitIndustry: (isValid: boolean, industryExperience: IndustryExperienceData) => void;
  onDeleteTE: (id: number) => void;
  onDeleteIndustry: (id: number) => void;
  onDeleteUnits: (id: number) => void;
  onSubmitUnits: (isValid: boolean, units: UnitsICanTeachData) => void;
};

const ExperienceContainer: FC<ExperienceProps> = ({
  teachingExperience,
  industryExperience,
  unitsICanTeach,
  onSubmitTE,
  onDeleteTE,
  onDeleteIndustry,
  onSubmitIndustry,
  onDeleteUnits,
  onSubmitUnits,
}): JSX.Element => {
  const [isTEModalVisible, setIsTEModalVisible] = useState<boolean>(false);
  const [isIndustryModalVisible, setIsIndustryModalVisible] = useState<boolean>(false);
  const [isUnitsModalVisible, setIsUnitsModalVisible] = useState<boolean>(false);

  const getPoints = (units: Array<Unit>): Array<Point> => units.map((unit: Unit) =>
    ({ id: unit.rowID || 0, label: `${unit.code} ${unit.title}` }));

  const teListItems: Array<ListItem> = teachingExperience.map((te: TeachingExperience): ListItem => ({
    title: te.orgName,
    list: [`${te.started} - ${te.completed}`],
    points: getPoints(te.units as Array<Unit>),
  }));

  const industryListItems: Array<ListItem> = industryExperience.map((industry: IndustryExperience): ListItem => ({
    id: industry.rowID,
    title: industry.Company,
    list: [industry.positionTitle, `${industry.started} - ${industry.completed}`],
    points: getPoints(industry.units as Array<Unit>),
    fileName: industry.positionDescription,
  }));

  const unitsListItems: Array<ListItem> = unitsICanTeach.map((unit: UnitsICanTeach): ListItem => ({
    title: unit.orgName,
    points: getPoints(unit.units as Array<Unit>),
  }));

  const handleSubmitTeachingExperience = (isValid: boolean, experience: TeachingExperienceData) => {
    if (isValid) {
      setIsTEModalVisible(false);
      onSubmitTE(isValid, experience);
    }
  };

  const handleDeleteTE = (id: number | undefined) => {
    if (id) {
      onDeleteTE(id);
    }
  };

  const handleSubmitIndustryExperience = (isValid: boolean, experience: IndustryExperienceData) => {
    if (isValid) {
      setIsTEModalVisible(false);
      onSubmitIndustry(isValid, experience);
    }
  };

  const handleDeleteIndustry = (id: number | undefined) => {
    if (id) {
      onDeleteIndustry(id);
    }
  };

  const handleSubmitUnits = (isValid: boolean, units: UnitsICanTeachData) => {
    if (isValid) {
      setIsUnitsModalVisible(false);
      onSubmitUnits(isValid, units);
    }
  };

  const handleDeleteUnits = (id: number | undefined) => {
    if (id) {
      onDeleteUnits(id);
    }
  };

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:mb-4">
      <List title="Teaching Experience" items={teListItems} onDeletePoint={handleDeleteTE}>
        <AddDetailsButton classes="tw:ml-auto" label="Add Teaching Experience" onClick={() => setIsTEModalVisible(true)} />
        <Modal title="Add Teaching Experience" showModal={isTEModalVisible} onClose={(isVisible) => setIsTEModalVisible(isVisible)}>
          <TeachingExperienceForm onSubmit={handleSubmitTeachingExperience} onCancel={() => setIsTEModalVisible(false)} />
        </Modal>
      </List>
      <List title="Industry Experience" items={industryListItems} onDelete={handleDeleteIndustry}>
        <AddDetailsButton classes="tw:ml-auto" label="Add Industry Experience" onClick={() => setIsIndustryModalVisible(true)} />
        <Modal title="Add Industry Experience" showModal={isIndustryModalVisible} onClose={(isVisible) => setIsIndustryModalVisible(isVisible)}>
          <IndustryExperienceForm onSubmit={handleSubmitIndustryExperience} onCancel={() => setIsIndustryModalVisible(false)} />
        </Modal>
      </List>
      <List title="Units I can Teach" items={unitsListItems} onDeletePoint={handleDeleteUnits}>
        <AddDetailsButton classes="tw:ml-auto" label="Units I can Teach" onClick={() => setIsUnitsModalVisible(true)} />
        <Modal title="Units I can Teach" showModal={isUnitsModalVisible} onClose={(isVisible) => setIsUnitsModalVisible(isVisible)}>
          <UnitsICanTeachForm onSubmit={handleSubmitUnits} onCancel={() => setIsUnitsModalVisible(false)} />
        </Modal>
      </List>
    </div>
  );
};

export default ExperienceContainer;

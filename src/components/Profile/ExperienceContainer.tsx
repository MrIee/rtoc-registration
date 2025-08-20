// import iconDelete from '../assets/images/icon-delete.svg';
import { useState, type FC, type JSX, type ReactNode } from 'react';
import AddDetailsButton from '../Inputs/AddDetailsButton';
import Modal from '../Modal';
import TeachingExperienceForm from './TeachingExperienceForm';
import IndustryExperienceForm from './IndustryExperienceForm';
import UnitsICanTeachForm from './UnitsICanTeachForm';
import ListCard from '../ListCard';
import List from '../List';
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
  TeachingExperienceCourse,
  TeachingExperienceUnit,
} from '../../utilities/interfaces';
import { printDateRange } from '../../utilities/helpers';
import classNames from 'classnames';

interface ExperienceProps {
  readOnly?: boolean;
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
  readOnly = false,
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

  const handleDeleteTE = (id: number | undefined) => {
    if (id) {
      onDeleteTE(id);
    }
  };

  const getPoints = (units: Array<Unit>): Array<Point> => units ? units.map((unit: Unit) =>
    ({ id: unit.rowID || 0, label: `${unit.code} ${unit.title}` })) : [];


  const getCourseList = (te: TeachingExperience): Array<ListItem> => {
    const getTEUnits = (units: Array<TeachingExperienceUnit>): Array<Point> => units.map((unit: TeachingExperienceUnit): Point =>
      ({ id: unit.rowID || 0, label: `${unit.unit} ${unit.unitTitle} (${unit.f_started} - ${unit.f_completed || 'current'})` }));

    if (te.courses) {
      return te.courses.map((course: TeachingExperienceCourse) => ({
        title: `${course.course} ${course.courseTitle}`,
        points: getTEUnits(course.units),
      }));
    }

    return [];
  };

  const teachingExperienceItems: ReactNode = teachingExperience.map((te: TeachingExperience, i: number) =>
    <div key={i} className="list__item">
      <h4 className="tw:mb-2">{ te.orgName }</h4>
      <div>
        <List items={getCourseList(te)} onDeletePoint={!readOnly ? handleDeleteTE : undefined} />
      </div>
    </div>
  );

  const industryListItems: Array<ListItem> = industryExperience.map((industry: IndustryExperience): ListItem => ({
    id: industry.rowID,
    title: industry.Company,
    list: [industry.positionTitle, printDateRange(industry.started, industry.completed)],
    points: getPoints(industry.units as Array<Unit>),
    fileName: industry.positionDescription,
    fileURL: industry.pathName,
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

  const handleSubmitIndustryExperience = (isValid: boolean, experience: IndustryExperienceData) => {
    if (isValid) {
      setIsIndustryModalVisible(false);
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
      <div className={classNames({ 'list': teachingExperience.length > 0 })}>
        <div className="tw:flex tw:items-center tw:justify-between">
          {teachingExperience.length > 0 && <h3>Teaching Experience</h3>}
            { !readOnly &&
              <div className={classNames({'tw:w-full': teachingExperience.length === 0})}>
                <AddDetailsButton classes="tw:ml-auto" label="Add Teaching Experience" onClick={() => setIsTEModalVisible(true)} />
                <Modal title="Add Teaching Experience" showModal={isTEModalVisible} onClose={(isVisible) => setIsTEModalVisible(isVisible)}>
                  <TeachingExperienceForm onSubmit={handleSubmitTeachingExperience} onCancel={() => setIsTEModalVisible(false)} />
                </Modal>
              </div>
            }
        </div>
        <div className="tw:w-full">{ teachingExperienceItems }</div>
      </div>
      <ListCard title="Industry Experience" items={industryListItems} onDelete={!readOnly ? handleDeleteIndustry : undefined}>
        { !readOnly &&
          <>
            <AddDetailsButton classes="tw:ml-auto" label="Add Industry Experience" onClick={() => setIsIndustryModalVisible(true)} />
            <Modal title="Add Industry Experience" showModal={isIndustryModalVisible} onClose={(isVisible) => setIsIndustryModalVisible(isVisible)}>
              <IndustryExperienceForm onSubmit={handleSubmitIndustryExperience} onCancel={() => setIsIndustryModalVisible(false)} />
            </Modal>
          </>
        }
      </ListCard>
      <ListCard title="Units I can Teach" items={unitsListItems} onDeletePoint={!readOnly ? handleDeleteUnits : undefined}>
        { !readOnly &&
          <>
            <AddDetailsButton classes="tw:ml-auto" label="Units I can Teach" onClick={() => setIsUnitsModalVisible(true)} />
            <Modal title="Units I can Teach" showModal={isUnitsModalVisible} onClose={(isVisible) => setIsUnitsModalVisible(isVisible)}>
              <UnitsICanTeachForm onSubmit={handleSubmitUnits} onCancel={() => setIsUnitsModalVisible(false)} />
            </Modal>
          </>
        }
      </ListCard>
    </div>
  );
};

export default ExperienceContainer;

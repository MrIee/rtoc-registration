import { useEffect, useState, type FC, type JSX } from 'react';
import debounce from 'lodash.debounce';
import { EXPERIENCE_TYPES } from '../utilities/constants';
import {
  type IndustryExperience,
  type MatrixExperience,
  type MatrixExperienceCourse,
  type Activity,
  type MatrixExperienceUnit,
  type Subscription,
} from '../utilities/interfaces';
import {
  getMatrixExperience,
  updateMatrixExperience,
  getActivities,
  updateActivity,
  createActivity,
  getIndustryExperience,
  getSubscriptions,
  updateSubscription,
  createSubscription,
  deleteActivity,
  deleteSubscription,
} from '../utilities/data';
import Loader from '../components/Loader';
import Accordion from '../components/Accordion';
import ExperienceTable from '../components/Matrix/ExperienceTable';
import VETActivitiesTable from '../components/Matrix/VETActivitiesTable';
import WorkExperienceTable from '../components/Matrix/WorkExperienceTable';
import SubscriptionTable from '../components/Matrix/SubscriptionTable';

const Matrix: FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experience, setExperience] = useState<Array<MatrixExperience>>([]);
  const [currentIndustryActivities, setCurrentIndustryActivities] = useState<Array<Activity>>([]);
  const [previousIndustryActivities, setPreviousIndustryActivities] = useState<Array<Activity>>([]);
  const [currentVETActivities, setCurrentVETActivities] = useState<Array<Activity>>([]);
  const [previousVETActivities, setPreviousVETActivities] = useState<Array<Activity>>([]);
  const [workExperience, setWorkExperience] = useState<Array<IndustryExperience>>([]);
  const [vetSubscriptions, setVETSubscriptions] = useState<Array<Subscription>>([]);
  const [industrySubscriptions, setIndustrySubscriptions] = useState<Array<Subscription>>([]);

  useEffect(() => {
    const loadData = async () => {
      await loadMatrixExperience();
      await loadActivities();
      await loadWorkExperience();
      await loadSubscriptions();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const loadMatrixExperience = async () => {
    const res = await getMatrixExperience();
    setExperience(res);
  };

  const getMatrixExperienceCourses = (experience: Array<MatrixExperience>): Array<MatrixExperienceCourse> => {
    const courseArray: Array<MatrixExperienceCourse> = [];

    experience.forEach((teachingExperience: MatrixExperience) => {
      teachingExperience.courses.forEach((course: MatrixExperienceCourse) => {
        courseArray.push(course);
      });
    });

    return courseArray;
  };

  const loadActivities = async () => {
    const res = await getActivities();
    const currentIndustry: Array<Activity> = [];
    const previousIndustry: Array<Activity> = [];
    const currentVET: Array<Activity> = [];
    const previousVET: Array<Activity> = [];

    res.forEach((activity: Activity) => {
      if (activity.section === EXPERIENCE_TYPES.INDUSTRY) {
        if (activity.year_category === 'current') {
          currentIndustry.push(activity);
        }

        if (activity.year_category === 'previous') {
          previousIndustry.push(activity);
        }
      }

      if (activity.section === EXPERIENCE_TYPES.VET) {
        if (activity.year_category === 'current') {
          currentVET.push(activity);
        }

        if (activity.year_category === 'previous') {
          previousVET.push(activity);
        }
      }
    });

    setCurrentIndustryActivities(currentIndustry);
    setPreviousIndustryActivities(previousIndustry);
    setCurrentVETActivities(currentVET);
    setPreviousVETActivities(previousVET);
  };

  const loadWorkExperience = async () => {
    const res = await getIndustryExperience();
    setWorkExperience(res);
  };

  const loadSubscriptions = async () => {
    const res = await getSubscriptions();
    const vetSubscriptions: Array<Subscription> = [];
    const industrySubscriptions: Array<Subscription> = [];

    res.forEach((subscription: Subscription) => {
      if (subscription.section === EXPERIENCE_TYPES.VET) {
        vetSubscriptions.push(subscription);
      }

      if (subscription.section === EXPERIENCE_TYPES.INDUSTRY) {
        industrySubscriptions.push(subscription);
      }
    });

    setVETSubscriptions(vetSubscriptions);
    setIndustrySubscriptions(industrySubscriptions);
  };

  const handleOnChangeActivities = debounce(async (activity: Activity) => {
    if (activity.rowID) {
      updateActivity(activity.rowID, activity);
    }
  }, 500);

  const handleOnChangExperience = debounce(async (unit: MatrixExperienceUnit) => {
    if (unit.rowID) {
      updateMatrixExperience(unit.rowID, unit);
    }
  }, 500);

  const handleOnChangeSubscription = debounce(async (subscription: Subscription) => {
    if (subscription.rowID) {
      updateSubscription(subscription.rowID, subscription);
    }
  }, 500);

  const handleOnSubmitActivity = async (isFormValid: boolean, activity: Activity) => {
    if (isFormValid) {
      const res = await createActivity(activity);

      if (res) {
        await loadActivities();
      }
    }
  };

  const handleOnDeleteActivity = async (rowID: number) => {
    await deleteActivity(rowID);
    loadActivities();
  };

  const handleOnSubmitSubscription = async (isFormValid: boolean, subscription: Subscription) => {
    if (isFormValid) {
      const res = await createSubscription(subscription);

      if (res) {
        await loadSubscriptions();
      }
    }
  };

  const handleOnDeleteSubscription = async (rowID: number) => {
    await deleteSubscription(rowID);
    loadSubscriptions();
  };

  return (
    <>
    { isLoading ? (
        <Loader typeToBeLoaded="Matrix" />
      ) : (
        <div className="matrix">
          <Accordion title="1. Mapping of Qualifications and Vocational Experience">
            <div className="matrix__section">
              <ExperienceTable courses={getMatrixExperienceCourses(experience)} onChange={handleOnChangExperience} />
            </div>
          </Accordion>
          <Accordion title="2. Professional Development Activities" isParent>
            <Accordion title="2A Record of VET Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesTable
                  activities={previousVETActivities}
                  onChange={handleOnChangeActivities}
                  onSubmit={handleOnSubmitActivity}
                  onDelete={handleOnDeleteActivity}
                />
              </div>
            </Accordion>
            <Accordion title="2B Record of Industry Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesTable
                  activities={previousIndustryActivities}
                  onChange={handleOnChangeActivities}
                  onSubmit={handleOnSubmitActivity}
                  onDelete={handleOnDeleteActivity}
                />
              </div>
            </Accordion>
            <Accordion title="2C Record of VET Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesTable
                activities={currentVETActivities}
                onChange={handleOnChangeActivities}
                onSubmit={handleOnSubmitActivity}
                onDelete={handleOnDeleteActivity}
              />
              </div>
            </Accordion>
            <Accordion title="2D Record of Industry Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesTable
                  activities={currentIndustryActivities}
                  onChange={handleOnChangeActivities}
                  onSubmit={handleOnSubmitActivity}
                  onDelete={handleOnDeleteActivity}
                />
              </div>
            </Accordion>
          </Accordion>
          <Accordion title="3. Work Experience">
            <div className="matrix__section">
              <WorkExperienceTable experience={workExperience} />
            </div>
          </Accordion>
          <Accordion title="4. Professional Subscriptions and Memberships" isParent>
            <Accordion title="4A VET Subscriptions and Memberships">
              <div className="matrix__section">
                <SubscriptionTable
                  subscriptions={vetSubscriptions}
                  onChange={handleOnChangeSubscription}
                  onSubmit={handleOnSubmitSubscription}
                  onDelete={handleOnDeleteSubscription}
                />
              </div>
            </Accordion>
            <Accordion title="4B Industry Subscriptions and Memberships">
              <div className="matrix__section">
                <SubscriptionTable
                  subscriptions={industrySubscriptions}
                  onChange={handleOnChangeSubscription}
                  onSubmit={handleOnSubmitSubscription}
                  onDelete={handleOnDeleteSubscription}
                />
              </div>
            </Accordion>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default Matrix;

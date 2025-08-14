import { useEffect, useState, type FC, type JSX } from 'react';
import debounce from 'lodash.debounce';
import {
  newGroupedActivity,
  type GroupedActivities,
  type IndustryExperience,
  type MatrixExperience,
  type MatrixExperienceCourse,
  newGroupedSubscription,
  type GroupedSubscription,
  type Activity,
  type MatrixExperienceUnit,
  type Subscription,
} from '../utilities/interfaces';
import {
  getMatrixExperience,
  updateMatrixExperience,
  getMatrixActivitiesGrouped,
  updateActivity,
  getIndustryExperience,
  getSubscriptionsGrouped,
  updateSubscription,
} from '../utilities/data';
import Loader from '../components/Loader';
import Accordion from '../components/Accordion';
import ExperienceForm from '../components/Matrix/ExperienceForm';
import VETActivitiesForm from '../components/Matrix/VETActivitiesForm';
import WorkExperienceForm from '../components/Matrix/WorkExperienceForm';
import SubscriptionForm from '../components/Matrix/SubscriptionForm';

const Matrix: FC = (): JSX.Element => {
  const newGroupedActivities = newGroupedActivity;
  const newGroupedSubscriptions = newGroupedSubscription;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experience, setExperience] = useState<Array<MatrixExperience>>([]);
  const [activities, setActivities] = useState<GroupedActivities>(newGroupedActivities);
  const [workExperience, setWorkExperience] = useState<Array<IndustryExperience>>([]);
  const [subscriptions, setSubscriptions] = useState<GroupedSubscription>(newGroupedSubscriptions);

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
    const res = await getMatrixActivitiesGrouped();
    setActivities(res);
  };

  const loadWorkExperience = async () => {
    const res = await getIndustryExperience();
    setWorkExperience(res);
  };

  const loadSubscriptions = async () => {
    const res = await getSubscriptionsGrouped();
    setSubscriptions(res);
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

  return (
    <>
    {
      isLoading ? (
        <Loader typeToBeLoaded="Matrix" />
      ) : (
        <div className="matrix">
          <Accordion title="1. Mapping of Qualifications and Vocational Experience">
            <div className="matrix__section">
              <ExperienceForm courses={getMatrixExperienceCourses(experience)} onChange={handleOnChangExperience} />
            </div>
          </Accordion>
          <Accordion title="2. Professional Development Activities" isNested>
            <Accordion title="2A Record of VET Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesForm activities={activities.VET.previous} onChange={handleOnChangeActivities} />
              </div>
            </Accordion>
            <Accordion title="2B Record of Industry Activities for Previous Year">
              <div className="matrix__section">
                <VETActivitiesForm activities={activities.industry.previous} onChange={handleOnChangeActivities} />
              </div>
            </Accordion>
            <Accordion title="2C Record of VET Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesForm activities={activities.VET.current} onChange={handleOnChangeActivities} />
              </div>
            </Accordion>
            <Accordion title="2D Record of Industry Activities for Current Year">
              <div className="matrix__section">
                <VETActivitiesForm activities={activities.industry.current} onChange={handleOnChangeActivities} />
              </div>
            </Accordion>
          </Accordion>
          <Accordion title="3. Work Experience">
            <div className="matrix__section">
              <WorkExperienceForm experience={workExperience} />
            </div>
          </Accordion>
          <Accordion title="4. Professional Subscriptions and Memberships" isNested>
            <Accordion title="4A VET Subscriptions and Memberships">
              <div className="matrix__section">
                <SubscriptionForm subscriptions={subscriptions.VET} onChange={handleOnChangeSubscription} />
              </div>
            </Accordion>
            <Accordion title="4V Industry Subscriptions and Memberships">
              <div className="matrix__section">
                <SubscriptionForm subscriptions={subscriptions.industry} onChange={handleOnChangeSubscription} />
              </div>
            </Accordion>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default Matrix;

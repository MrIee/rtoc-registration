import logo from '../assets/images/logo-rtoc.png';
import { getAQFString } from '../utilities/helpers';
import { useEffect, useState, type FC, type JSX } from 'react';
import { getUser, getUserProfile } from '../utilities/data';
import type {
  IndustryExperience,
  ListItem,
  Point,
  Profile,
  TeachingExperience,
  TEQualification,
  Unit,
  UserDetails,
  VETQualificationDetails
} from '../utilities/interfaces';
import ListCard from '../components/ListCard';

const ProfileSummary: FC = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null);
  const [userProfile, setUserProfile] = useState<Profile| null>(null);

  useEffect(() => {
    const setUserData = async () => {
      const user = await getUser();
      setUserInfo(user);
      const profile = await getUserProfile(user?.URL || '');
      setUserProfile(profile);
    };

    setUserData();
  }, []);

  const getPoints = (units: Array<Unit>): Array<Point> => units.map((unit: Unit, i: number) =>
      ({ id: unit.rowID || i, label: `${unit.code} ${unit.title}` }));

  const vetQualificationsItems = userProfile?.vetQuals.map((data: VETQualificationDetails, i: number): ListItem => ({
    id: i,
    title: data.OrgName,
    list: [data.completed, `${data.course} ${data.title}`],
  })) || [];

  const teQualificationsItems = userProfile?.qualifications.map((data: TEQualification, i: number): ListItem => ({
    id: i,
    title: data.providerName,
    list: [data.completed, data.courseName, getAQFString(data.aqf.toString())],
  })) || [];

  const teachingExperienceItems =  userProfile?.vetTeach.map((data: TeachingExperience, i: number): ListItem => ({
    id: i,
    title: data.orgName,
    list: [`${data.started} - ${data.completed}`],
    points: getPoints(data.units as Array<Unit>),
  })) || [];

  const industryExperienceItems = userProfile?.industry.map((data: IndustryExperience, i: number): ListItem => ({
    id: i,
    title: data.Company,
    list: [data.positionTitle, `${data.started} - ${data.completed}`],
    points: getPoints(data.units as Array<Unit>),
  })) || [];

  return (
    <>
      <div className="tw:w-[980px] tw:flex tw:flex-col tw:py-9 tw:mx-auto">
        <img className="tw:w-20 tw:mb-1 tw:self-center" src={logo} alt="logo" />
        <div className="tw:flex tw:flex-col tw:mb-6">
          <h2>{userProfile?.firstname} {userProfile?.familyname}</h2>
          <span className="tw:text-gray-800 tw:text-xl tw:uppercase">{userProfile?.type}</span>
          <span>{userInfo?.email}</span>
          <span>{userInfo?.phone}</span>
        </div>
        <ListCard display="row" title="Vet Qualifications" items={vetQualificationsItems} />
        <ListCard display="row" title="Credentials" items={teQualificationsItems} />
        <ListCard display="row" title="Teaching Experience" items={teachingExperienceItems} />
        <ListCard display="row" title="Industry Experience" items={industryExperienceItems} />
      </div>
    </>
  );
};

export default ProfileSummary;

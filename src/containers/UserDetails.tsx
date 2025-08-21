import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch } from 'react-redux';
import { setPicture } from '../store/userPictureSlice';
import { CONTENT_URL } from '../utilities/constants';
import type { Address, PersonalDetails, UserDetails, UserDetailsFormFields, UserPicture } from '../utilities/interfaces';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import PersonalDetailsForm from '../components/Profile/PersonalDetailsForm';
import { getUser, createUserPicture } from '../utilities/data';
import Loader from '../components/Loader';

const UserDetailsComponent: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fieldsToInclude: UserDetailsFormFields = {
    preferredname: false,
    password: false,
    address: true,
    nextBtn: false,
  };

  useEffect(() => {
    const loadUserDetails = async () => {
      const user: UserDetails = await getUser();
      setPersonalDetails({ ...user, address1: '', address2: '', suburb: '', postcode: '', state: '' });
      setIsLoading(false);
    };

    loadUserDetails();
  }, []);

  const onSubmit = (isValid: boolean, userDetails: UserDetails, address?: Address) => {
    console.log(isValid);
    console.log(userDetails);
    console.log(address);
  };

  const onSubmitPicture = async (file: File) => {
    const picture: UserPicture = await createUserPicture(file);

    if (picture.thumbImage) {
      dispatch(setPicture(CONTENT_URL + picture.thumbImage));
    }
  };

  return (
    <>
      { isLoading ? (
        <Loader typeToBeLoaded="Personal Information" />
      ) : (
        <div className="tw:w-full">
          <ProfilePictureUpload classes="tw:mb-6" onSubmit={onSubmitPicture} />
          <PersonalDetailsForm personalDetails={personalDetails} onSubmit={onSubmit} includeFields={fieldsToInclude} />
        </div>
      )}
    </>
  );
};

export default UserDetailsComponent;

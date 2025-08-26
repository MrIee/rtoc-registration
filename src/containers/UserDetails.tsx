import { useEffect, useState, type FC, type JSX } from 'react';
import { useDispatch } from 'react-redux';
import { setPicture } from '../store/userPictureSlice';
import { CONTENT_URL } from '../utilities/constants';
import type { Address, PersonalDetails, UserDetails, UserDetailsFormFields, UserPicture } from '../utilities/interfaces';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import PersonalDetailsForm from '../components/Profile/PersonalDetailsForm';
import { getUser, createUserPicture, createAddress, getAddress } from '../utilities/data';
import Loader from '../components/Loader';

const UserDetailsComponent: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fieldsToInclude: UserDetailsFormFields = {
    preferredname: false,
    password: false,
    address: true,
    nextBtn: false,
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    const user: UserDetails = await getUser();
    const address: Address = await getAddress();
    setPersonalDetails({ ...user, ...address });
    setIsLoading(false);
  };

  const toggleSuccessMessage = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const onSubmit = async (isValid: boolean, userDetails: UserDetails, address?: Address) => {
    if (isValid) {
      if (userDetails) {
        console.log(userDetails);
      }

      if (address) {
        await createAddress(address);
      }
      await loadUserDetails();
      toggleSuccessMessage();
    }
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
          { showSuccessMessage &&
            <div className="tw:h-8 tw:p-3 tw:mt-4 tw:flex tw:justify-center tw:items-center tw:bg-green-500 tw:rounded-xl">
              <span className="tw:text-white">User details saved successfully</span>
            </div>
          }
        </div>
      )}
    </>
  );
};

export default UserDetailsComponent;

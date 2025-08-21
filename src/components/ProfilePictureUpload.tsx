import { useEffect, useState, type FC, type JSX } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import classNames from 'classnames';
import FileUpload from './Inputs/FileUpload';

interface ProfilePictureProps {
  classes?: string;
  onSubmit?: (file: File) => void;
};

const ProfilePictureUpload: FC<ProfilePictureProps> = ({ classes, onSubmit }): JSX.Element => {
  const [pictureUrl, setPictureUrl] = useState<string>('');
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureError, setPictureError] = useState<string>('');
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
  const currentPictureUrl: string = useSelector((state: RootState) => state.userPicture.pictureUrl);

  useEffect(() => {
    setPictureUrl(currentPictureUrl);
  }, [currentPictureUrl]);

  const onPictureError = (error: string) => {
    setPictureError(error);
  };

  const handleOnChangePicture = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
        if (readerEvent?.target?.result) {
          setPictureUrl((readerEvent.target.result.toString()));
        }
      };
      reader.readAsDataURL(file);
      setPictureFile(file);
    }
  };

  const handleOnSubmit = () => {
    if (pictureFile) {
      onSubmit?.(pictureFile);
    }
  };

  return (
    <div className={classNames('tw:flex tw:flex-col', classes)}>
      <div className="tw:flex tw:items-center tw:gap-4">
        { pictureUrl && <img className="tw:h-16 tw:w-16 tw:rounded-full tw:object-cover" src={pictureUrl} alt="Profile Picture" /> }
        <FileUpload
          showIcon={false}
          showFile={false}
          showError={false}
          btnLabel="Upload new picture"
          allowedTypes={allowedTypes}
          onChange={handleOnChangePicture}
          onError={onPictureError}
        />
        <button className="btn" onClick={handleOnSubmit}>Save Picture</button>
      </div>
      <span className="tw:text-sm tw:text-red-500 tw:ml-20">{pictureError}</span>
    </div>
  );
};

export default ProfilePictureUpload;

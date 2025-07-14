import classNames from 'classnames';
import iconPaperClip from '../assets/images/icon-paperclip.svg';
import iconDelete from '../assets/images/icon-delete.svg';
import { useEffect, useRef, useState, type ChangeEvent, type FC, type JSX } from 'react';
import type { InputPropsNoEvents } from '~/utilities/interfaces';

interface FileUploadProps extends InputPropsNoEvents {
  onChange?: (file: File) => void;
  onBlur?: () => void;
};

const FileUpload: FC<FileUploadProps> = ({ label, name, required = true, error, onChange, onBlur }): JSX.Element => {
  const [chosenFile, setChosenFile] = useState<File | null>(null);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = useState<string>(error || '');

  useEffect(() => {
    setFileError(error || '');
  }, [error]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file: File = event.target.files[0];

      if (file) {
        const isValidFileType: boolean = validateFileType(file);

        if (isValidFileType) {
          setChosenFile(file);
          onChange?.(file);
        }
      }
    }
  };

  const validateFileType = (file: File): boolean => {
    if (file) {
      const allowedTypes = ['application/pdf']; // Define allowed MIME types
      setFileError('');

      if (allowedTypes.includes(file.type)) {
        return true;
      } else {
        setFileError('Invalid file type. Please choose a PDF file.');
        setChosenFile(null);
        return false;
      }
    }

    return false;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB'];

    if (bytes === 0) {
      return '0 Bytes';
    }

    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleOnClickUploadBtn = () => {
    fileUploadRef.current?.click();
  };

  return (
    <div className="tw:flex tw:flex-col">
      <label className="tw:inline-flex tw:flex-col tw:justify-start tw:items-start tw:self-start tw:mb-4">
        { label && <span className="label__text">{label}{ required && (<span>*</span>)}</span> }
        <button className="btn btn--hollow btn--hollow-sm tw:flex" type="button" onClick={handleOnClickUploadBtn}>
          <img className="tw:mr-1" src={iconPaperClip} alt="paperclip" />
          Attach File
        </button>
        <input
          ref={fileUploadRef}
          className={classNames('tw:w-full', { 'tw:border-red-500 tw:border-2 tw:outline-red-500': fileError })}
          type="file"
          name={name}
          required={required}
          onChange={handleOnChange}
          onBlur={onBlur}
          hidden
        />
      </label>
      { chosenFile &&
        <div className="tw:flex tw:justify-between tw:p-4 tw:rounded-lg tw:bg-gray-100">
          <span>{chosenFile.name} {formatFileSize(chosenFile.size)}</span>
          <img className="tw:cursor-pointer" src={iconDelete} alt="remove file icon" onClick={() => setChosenFile(null)} />
        </div>
      }
      { fileError && <span className="tw:text-sm tw:text-red-500">{fileError}</span> }
    </div>
  );
};

export default FileUpload;

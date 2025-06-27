import plusIcon from "../assets/images/icon-plus.svg";
import { useState, type FC, type JSX, type PropsWithChildren } from "react";
import UpdateDetailsModal from "./UpdateDetailsModal";
import VETQualificationsForm from "./VETQualificationsForm";

const VETQualifications: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
      <button className="btn btn--hollow tw:flex tw:ml-auto" onClick={() => setIsModalVisible(true)}>
        <img className="tw:mr-1.5" src={plusIcon} alt="plus icon" />
        Add VET Qualifications
      </button>
      <UpdateDetailsModal title="Add Qualifications" showModal={isModalVisible} onClose={(isVisible) => setIsModalVisible(isVisible)}>
        <VETQualificationsForm />
      </UpdateDetailsModal>
      {children}
    </>
  );
};

export default VETQualifications;

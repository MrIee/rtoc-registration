import plusIcon from "../assets/images/icon-plus.svg";
import AddDetailsModal from "./AddDetailsModal";

const VETQualifications = () => {
  return (
    <>
      <AddDetailsModal title="Add Qualifications">
        <button className="btn btn--hollow tw:flex tw:ml-auto">
          <img className="tw:mr-1.5" src={plusIcon} alt="plus icon" />
          Add VET Qualifications
        </button>
      </AddDetailsModal>
    </>
  );
};

export default VETQualifications;

import React from "react";
import BookModal from "./TransactionModals/BookModal";
import ScheduleModal from "./TransactionModals/ScheduleModal";
import DispatchModal from "./TransactionModals/DispatchModal";

const Modal = ({
  user,
  setError,
  error,
  handleAutocompleteChange,
  open,
  onClose,
  formData,
  handleInputChange,
  handleFormSubmit,
}) => {
  let ModalComponent;
  switch (user.userType) {
    case "GEN" || "TRP" || "IFM":
      ModalComponent = (
        <BookModal
          user={user}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      );
      break;
    case 2:
      ModalComponent = (
        <ScheduleModal
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      );
      break;
    case 3:
      ModalComponent = (
        <DispatchModal
          user={user}
          error={error}
          handleAutocompleteChange={handleAutocompleteChange}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      );
      break;
    default:
      ModalComponent = (
        <BookModal
          user={user}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      );
  }

  return <div>{ModalComponent}</div>;
};

export default Modal;

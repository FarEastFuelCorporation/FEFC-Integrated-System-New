import React from "react";
import BookModal from "./TransactionModals/BookModal";
import ScheduleModal from "./TransactionModals/ScheduleModal";
import DispatchModal from "./TransactionModals/DispatchModal";
import ReceiveModal from "./TransactionModals/ReceiveModal";
import SortModal from "./TransactionModals/SortModal";
import TreatModal from "./TransactionModals/TreatModal";

const Modal = ({
  user,
  error,
  handleAutocompleteChange,
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  setErrorMessage,
  showErrorMessage,
  setShowErrorMessage,
  setIsDiscrepancy,
  isDiscrepancy,
}) => {
  let ModalComponent;
  switch (user.userType) {
    case "GEN":
    case "TRP":
    case "IFM":
      ModalComponent = (
        <BookModal
          user={user}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
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
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
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
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 4:
      ModalComponent = (
        <ReceiveModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 5:
      ModalComponent = (
        <SortModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
          setIsDiscrepancy={setIsDiscrepancy}
          isDiscrepancy={isDiscrepancy}
        />
      );
      break;
    case 6:
      ModalComponent = (
        <TreatModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
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
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
  }

  return <div>{ModalComponent}</div>;
};

export default Modal;

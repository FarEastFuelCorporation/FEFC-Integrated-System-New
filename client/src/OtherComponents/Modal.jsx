import React, { forwardRef } from "react";
import BookModal from "./TransactionModals/BookModal";
import ScheduleModal from "./TransactionModals/ScheduleModal";
import DispatchModal from "./TransactionModals/DispatchModal";
import ReceiveModal from "./TransactionModals/ReceiveModal";
import SortModal from "./TransactionModals/SortModal";
import TreatModal from "./TransactionModals/TreatModal";
import AttachmentModal from "./TransactionModals/AttachmentModal";
import CertifyModal from "./TransactionModals/CertifyModal";
import BillModal from "./TransactionModals/BillModal";
import BillingApprovalModal from "./TransactionModals/BillingApprovalModal";
import BillingDistributionModal from "./TransactionModals/BillingDistributionModal";
import CollectionModal from "./TransactionModals/CollectionModal";
import WarehouseModal from "./TransactionModals/WarehouseModal";
import WarehouseOutModal from "./TransactionModals/WarehouseOutModal";
import CommissionModal from "./TransactionModals/CommissionModal";
import CommissionApprovalModal from "./TransactionModals/CommissionApprovalModal";

const Modal = forwardRef(
  (
    {
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
      refs,
      isWasteNameToBill,
      setIsWasteNameToBill,
      isPerClientToBill,
      setIsPerClientToBill,
      isIndividualBillingToBill,
      setIsIndividualBillingToBill,
      isIndividualWasteToBill,
      setIsIndividualWasteToBill,
      isChargeToBill,
      setIsChargeToBill,
      discount,
      setDiscount,
      schedule,
      commission,
    },
    ref
  ) => {
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
        ModalComponent = schedule ? (
          <ScheduleModal
            open={open}
            onClose={onClose}
            formData={formData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            errorMessage={errorMessage}
            showErrorMessage={showErrorMessage}
          />
        ) : (
          <CommissionModal
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
      case 7:
        ModalComponent = (
          <CertifyModal
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
      case 8:
        ModalComponent = (
          <BillModal
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
            refs={refs}
            isWasteNameToBill={isWasteNameToBill}
            setIsWasteNameToBill={setIsWasteNameToBill}
            isPerClientToBill={isPerClientToBill}
            setIsPerClientToBill={setIsPerClientToBill}
            isIndividualBillingToBill={isIndividualBillingToBill}
            setIsIndividualBillingToBill={setIsIndividualBillingToBill}
            isIndividualWasteToBill={isIndividualWasteToBill}
            setIsIndividualWasteToBill={setIsIndividualWasteToBill}
            isChargeToBill={isChargeToBill}
            setIsChargeToBill={setIsChargeToBill}
            discount={discount}
            setDiscount={setDiscount}
          />
        );
        break;
      case 9:
        ModalComponent = commission ? (
          <CommissionApprovalModal
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
            refs={refs}
          />
        ) : (
          <BillingApprovalModal
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
            refs={refs}
          />
        );
        break;
      case 10:
        ModalComponent = (
          <BillingDistributionModal
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
            refs={refs}
          />
        );
        break;
      case 11:
        ModalComponent = (
          <CollectionModal
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
            refs={refs}
          />
        );
        break;
      case 14:
        ModalComponent = (
          <WarehouseModal
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
            setIsDiscrepancy={setIsDiscrepancy}
            isDiscrepancy={isDiscrepancy}
            refs={refs}
            ref={ref}
          />
        );
        break;
      case 15:
        ModalComponent = (
          <WarehouseOutModal
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
            refs={refs}
            ref={ref}
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

    <AttachmentModal
      errorMessage={errorMessage}
      showErrorMessage={showErrorMessage}
    />;

    return <div>{ModalComponent}</div>;
  }
);

export default Modal;

import { useCallback } from "react";

const useProcessTransaction = () => {
  const processDataTransaction = useCallback((response, setTransactions) => {
    console.log(response);
    // const transactions = response || [];
    // const flattenedData = transactions.map((item) => {
    //   const haulingDate = item.haulingDate ? new Date(item.haulingDate) : null;
    //   const createdDate = item.createdAt ? new Date(item.createdAt) : null;

    //   const haulingTime = item.haulingTime
    //     ? new Date(`1970-01-01T${item.haulingTime}Z`)
    //     : null;
    //   const createdTime = createdDate
    //     ? createdDate.toISOString().split("T")[1].slice(0, 8)
    //     : null;

    //   return {
    //     ...item,
    //     haulingDate: haulingDate?.toISOString().split("T")[0] || null,
    //     haulingTime:
    //       haulingTime?.toISOString().split("T")[1].slice(0, 5) || null,
    //     bookedCreatedDate: createdDate?.toISOString().split("T")[0] || null,
    //     bookedCreatedTime: createdTime,
    //     wasteName: item.QuotationWaste?.wasteName || null,
    //     vehicleType:
    //       item.QuotationTransportation?.VehicleType.typeOfVehicle || null,
    //     bookedRemarks: item.remarks,
    //   };
    // });
    // console.log(flattenedData);
    setTransactions(response); // Set transactions to the passed setter
  }, []);

  return { processDataTransaction };
};

export default useProcessTransaction;

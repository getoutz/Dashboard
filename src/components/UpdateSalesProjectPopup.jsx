import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const UpdateSalesProjectPopup = forwardRef(({ project }, ref) => {
  // console.log("project", project)
  const [formData, setFormData] = useState({
    workbomId: 0,
    workbomNo: 0,
    isOpenPopup: false,
    isRowPopupOpen: false,
    isDetailOpen: false,
    statusConceptSales: 1,
    statusPO: 1,
    statusDelivery: 1,
    statusINV: 1,
    statusADD: 1,
    username: "",
    percentConceptSales: 0,
    percentPO: 0,
    percentDelivery: 0,
    percentINV: 0,
    percentADD: 0,
    comment: "",
  });
  const dialogRef = useRef(null);
  const openPopup = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };
  const closePopup = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };
  useImperativeHandle(ref, () => ({
    openPopup,
    closePopup,
  }));

  //Props data from sales table page
  useEffect(() => {
    console.log("Received project in UpdateProjectPopup:", project);
    if (project) {
      setFormData((prevData) => ({
        ...prevData,
        workbomId: project?.workbom_id,
        workbomNo: project?.workbom_no,
        statusConceptSales: project.concept_status,
        statusPO: project.po_status,
        statusDelivery: project.delivery_status,
        statusINV: project.invoice_status,
        statusADD: project.addition_status,
        percentConceptSales: project.concept_percent,
        percentPO: project.po_percent,
        percentDelivery: project.delivery_percent,
        percentINV: project.invoice_percent,
        percentADD: project.addition_percent,
      }));
      //console.log(formData.workbomId, "workId");
    }
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        username: session.username,
      }));
    }
  }, [project]);

  //Add another useEffect to log when formData updates
  // useEffect(() => {
  //   console.log("Updated formData.workbomId:", formData.workbomId);
  // }, [formData.workbomId]); // Log whenever workbomId changes

  //Update Function
async function sendRequest(formData) {
  //console.log("📌 ข้อมูลที่กำลังส่งไป API:");
  // for (let [key, value] of Object.entries(formData)) {
  //     console.log(`${key}:`, value instanceof File ? value.name : value);
  // }
  if (!formData.workbomId) {
      console.error("❌ Error: Workbom ID is missing!");
      Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Workbom ID is missing!",
      });
      return;
  }
  let url = "http://192.168.1.150/updateprojectsale";
  let formDataToSend = new FormData();
  formDataToSend.append("workbomid", formData.workbomId);
  if (
    formData.statusConceptSales == 2 &&
    formData.percentConceptSales >= 0 &&
    formData.percentConceptSales <= 100 &&
    formData.percentConceptSales != project.concept_percent
  ) {
    formDataToSend.append("concept_percent", formData.percentConceptSales);
  } else if (formData.statusConceptSales == 3 &&
    formData.percentConceptSales >= 0 &&
    formData.percentConceptSales <= 100 &&
    formData.percentConceptSales != project.concept_percent) {
      formDataToSend.append("concept_percent", formData.percentConceptSales);
    }
  if (
    formData.statusPO == 2 &&
    formData.percentPO >= 0 &&
    formData.percentPO <= 100 &&
    formData.percentPO != project.po_percent
  ) {
    formDataToSend.append("po_percent", formData.percentPO);
  } else if (
    formData.statusPO == 3 &&
    formData.percentPO >= 0 &&
    formData.percentPO <= 100 &&
    formData.percentPO != project.po_percent) {
      formDataToSend.append("po_percent", formData.percentPO);
    }
  if (
    formData.statusDelivery == 2 &&
    formData.percentDelivery >= 0 &&
    formData.percentDelivery <= 100 &&
    formData.percentDelivery != project.delivery_percent
  ) {
    formDataToSend.append("delivery_percent", formData.percentDelivery);
  } else if (formData.statusDelivery == 3 &&
    formData.percentDelivery >= 0 &&
    formData.percentDelivery <= 100 &&
    formData.percentDelivery != project.delivery_percent) {
      formDataToSend.append("delivery_percent", formData.percentDelivery);
    }
  if (
    formData.statusINV == 2 &&
    formData.percentINV >= 0 &&
    formData.percentINV <= 100 &&
    formData.percentINV != project.invoice_percent
  ) {
    formDataToSend.append("invoice_percent", formData.percentINV);
  } else if (formData.statusINV == 3 &&
    formData.percentINV >= 0 &&
    formData.percentINV <= 100 &&
    formData.percentINV != project.invoice_percent) {
      formDataToSend.append("invoice_percent", formData.percentINV);
    }
  if (
    formData.statusADD == 2 &&
    formData.percentADD >= 0 &&
    formData.percentADD <= 100 &&
    formData.percentADD != project.addition_percent
  ) {
    formDataToSend.append("addition_percent", formData.percentADD);
  }  else if (formData.statusADD == 3 &&
    formData.percentADD >= 0 &&
    formData.percentADD <= 100 &&
    formData.percentADD != project.addition_percent) {
      formDataToSend.append("addition_percent", formData.percentADD);
    }
  if (formData.comment?.trim()) {
      formDataToSend.append("comment", formData.comment.trim());
  }
  formDataToSend.append("updateby", formData.username);
  //console.log("📌 FormData ที่ถูกส่ง:");
  // for (let pair of formDataToSend.entries()) {
  //     console.log(pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1]));
  // }
  let options = {
      method: "POST",
      headers: {
          Authorization: "d33ed78e6b418e9999d4257a08768634",
      },
      body: formDataToSend,
  };
  try {
      const response = await fetch(url, options);
      if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.error || `HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error("❌ API Error:", error);
      throw error;
  }
}

const handleUpdatePopup = async (event) => {
  event.preventDefault();
  const updatedFormData = {
    workbomId: formData.workbomId,
    statusConceptSales: formData.statusConceptSales,
    statusPO: formData.statusPO,
    statusDelivery: formData.statusDelivery,
    statusINV : formData.statusINV,
    statusADD : formData.statusADD,
    percentConceptSales: formData.percentConceptSales,
    percentPO: formData.percentPO,
    percentDelivery: formData.percentDelivery,
    percentINV: formData.percentINV,
    percentADD: formData.percentADD,
    comment: formData.comment,
    username: formData.username,
  };
  //console.log("📋 FormData ก่อนส่ง:", updatedFormData);
  closePopup();
  Swal.fire({
    title: "Update Project",
    text: "ยืนยันการอัปเดตข้อมูล?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1AACAC",
    cancelButtonColor: "#D8D9DA",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      closePopup();
      Swal.fire({
        title: "กำลังอัปเดตข้อมูล...",
        text: "กรุณารอสักครู่...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => Swal.showLoading(),
      });
      try {
        const response = await sendRequest(updatedFormData);
        if (!response) {
          throw new Error("API response is undefined");
        }
        //console.log("✅ API Response:", response);
        closePopup();
        Swal.fire({
          icon: "success",
          title: "Update Project",
          text: "อัปเดตข้อมูลสำเร็จ!",
        }).then(() => {
          sessionStorage.setItem("lastPage", window.location.pathname);
          window.location.reload();
        });
      } catch (error) {
        console.error("❌ API Error:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถอัปเดตข้อมูลได้",
        });
      }
    } else {
      // ถ้ากด Cancel ให้เปิด Popup กลับมา
      openPopup();
    }
  });
};

  return (
    <>
      <dialog
        ref={dialogRef}
        className="modal overflow-visible"
        onClick={(event) => event.stopPropagation()}
      >
       <div className="modal-box bg-white text-black overflow-visible w-[80vw] max-w-[900px] px-10 max-h-[90vh] flex flex-col overflow-y-auto pr-20 rounded-md">
          <form method="dialog">
            <button
              className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white absolute right-1 top-1"
            >
              ✕
            </button>
          </form>
          <div className="flex flex-col">
          <h3 className="text-sm badge bg-[#FFB200]/60 text-black border-none flex flex-row gap-1">
          <span className="font-bold">Workbom No: </span>{formData.workbomNo}
              </h3>         
          <header className="w-full h-full border-b border-gray-200 mb-5">
            <h3 className="font-extrabold mb-5 font-LexendDeca text-[#758694] text-xl flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chevron-double-up"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"
                />
                <path
                  fillRule="evenodd"
                  d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                />
              </svg>
              Update Your Project Status
            </h3>
          </header>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleUpdatePopup}>
            <label className="font-bold text-gray-700 text-base text-left">
              Status Percent{" "}
              <span className="text-orange-500 font-normal font-NotoSansThai">
                (ความคืบหน้าโปรเจค)
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4 w-full">
              {/** Concept Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusConceptSales == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-concept"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Concept (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"              
                  id="percent-concept"
                  type="number"
                  value={
                    formData.percentConceptSales === null
                      ? ""
                      : formData.percentConceptSales
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentConceptSales: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentConceptSales: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
             {/** PO Percent **/}
             <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusPO == 1 ? "hidden" : "block"
                }`}
              >
                <label htmlFor="percent-po" className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap">
                  PO (%)
                </label>
                <input
                 className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center" 
                  id="percent-po"
                  type="number"
                  value={formData.percentPO === null ? "" : formData.percentPO}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentPO: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      percentPO: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
             {/** Delivery Percent **/}
             <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusDelivery == 1 ? "hidden" : "block"
                }`}
              >
                <label htmlFor="percent-delivery" className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap">
                  Delivery (%)
                </label>
                <input
                 className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center" 
                  id="percent-delivery"
                  type="number"
                  value={formData.percentDelivery === null ? "" : formData.percentDelivery}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentDelivery: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      percentDelivery: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>             
              {/** Invoice Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusINV == 1 ? "hidden" : "block"
                }`}
              >
                <label htmlFor="percent-inv" className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap">
                 INV (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center" 
                  id="percent-inv"
                  type="number"
                  value={formData.percentINV === null ? "" : formData.percentINV}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentINV: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentINV: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
               {/** Addition Percent **/}
               <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusADD == 1 ? "hidden" : "block"
                }`}
              >
                <label htmlFor="percent-add" className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap">
                  ADD (%)
                </label>
                <input
                 className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center" 
                  id="percent-add"
                  type="number"
                  value={formData.percentADD === null ? "" : formData.percentADD}
                  hidden={formData.statusADD == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentADD: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      percentADD: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            {/** Comment Section **/}
            <label
              htmlFor="comment"
              className="font-bold text-gray-700 text-base text-left"
            >
              Comment{" "}
              <span className="text-orange-500 font-NotoSansThai font-normal">
                (ถ้ามี)
              </span>
              :
            </label>
            <textarea
              id="comment"
              placeholder="Type here.."
              className="w-full h-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 resize-none"
              value={formData.comment}
              autoComplete="off"
              onChange={(event) =>
                setFormData((prevData) => ({
                  ...prevData,
                  comment: event.target.value,
                }))
              }
            ></textarea>
            <div className="flex justify-center">
              <button
                className="w-auto h-auto px-12 py-2 rounded-lg mt-5 shadow font-extrabold text-sm text-white bg-[#FFA24C] hover:bg-[#FFAF00] focus:ring-4 focus:outline-none focus:ring-yellow-400 dark:focus:ring-orange-800"
                type="submit"    
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
});
export default UpdateSalesProjectPopup;


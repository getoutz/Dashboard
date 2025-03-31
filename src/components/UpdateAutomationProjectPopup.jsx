import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const UpdateAutomationProjectPopup = forwardRef(({ project }, ref) => {
  // console.log("project", project)
  const [formData, setFormData] = useState({
    workbomId: 0,
    workbomNo: 0,
    isOpenPopup: false,
    isRowPopupOpen: false,
    isDetailOpen: false,
    statusElectrical: 1,
    statusMechanic: 1,
    statusInstall: 1,
    statusSafetyCheck: 1,
    statusTestRun: 1,
    username: "",
    percentElectrical: 0,
    percentMechanic: 0,
    percentInstall: 0,
    percentSafetyCheck: 0,
    percentTestRun: 0,
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

  //Props data form automation table
  useEffect(() => {
    //console.log("Received project in UpdateProjectPopup:", project);
    if (project) {
      setFormData((prevData) => ({
        ...prevData,
        workbomId: project?.workbom_id,
        workbomNo: project?.workbom_no,
        statusElectrical: project.electrical_status,
        statusMechanic: project.mechanic_status,
        statusInstall: project.program_status,
        statusSafetyCheck: project.safetycheck_status,
        statusTestRun: project.testrun_status,
        percentElectrical: project.electrical_percent,
        percentMechanic: project.mechanic_percent,
        percentInstall: project.program_percent,
        percentSafetyCheck: project.safetycheck_percent,
        percentTestRun: project.testrun_percent,
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
  // }, [formData.workbomId]); //Log whenever workbomId changes

  //Update Function
  async function sendRequest(formData) {
    //console.log("📌 ข้อมูลที่กำลังส่งไป API:");
    // for (let [key, value] of Object.entries(formData)) {
    //   console.log(`${key}:`, value instanceof File ? value.name : value);
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
    let url = "http://192.168.1.150/updateprojectauto";
    let formDataToSend = new FormData();
    formDataToSend.append("workbomid", formData.workbomId);

    if (
      formData.statusElectrical == 2 &&
      formData.percentElectrical >= 0 &&
      formData.percentElectrical <= 100 &&
      formData.percentElectrical != project.electrical_percent
    ) {
      formDataToSend.append("electrical_percent", formData.percentElectrical);
    } else if (
      formData.statusElectrical == 3 &&
      formData.percentElectrical >= 0 &&
      formData.percentElectrical <= 100 &&
      formData.percentElectrical != project.electrical_percent
    ) {
      formDataToSend.append("electrical_percent", formData.percentElectrical);
    }
    if (
      formData.statusMechanic == 2 &&
      formData.percentMechanic >= 0 &&
      formData.percentMechanic <= 100 &&
      formData.percentMechanic != project.mechanic_percent
    ) {
      formDataToSend.append("mechanic_percent", formData.percentMechanic);
    } else if (
      formData.statusMechanic == 3 &&
      formData.percentMechanic >= 0 &&
      formData.percentMechanic <= 100 &&
      formData.percentMechanic != project.mechanic_percent
    ) {
      formDataToSend.append("mechanic_percent", formData.percentMechanic);
    }
    if (
      formData.statusInstall == 2 &&
      formData.percentInstall >= 0 &&
      formData.percentInstall <= 100 &&
      formData.percentInstall != project.program_percent
    ) {
      formDataToSend.append("program_percent", formData.percentInstall);
    } else if (
      formData.statusInstall == 3 &&
      formData.percentInstall >= 0 &&
      formData.percentInstall <= 100 &&
      formData.percentInstall != project.program_percent
    ) {
      formDataToSend.append("program_percent", formData.percentInstall);
    }
    if (
      formData.statusSafetyCheck == 2 &&
      formData.percentSafetyCheck >= 0 &&
      formData.percentSafetyCheck <= 100 &&
      formData.percentSafetyCheck != project.safetycheck_percent
    ) {
      formDataToSend.append("safetycheck_percent", formData.percentSafetyCheck);
    } else if (
      formData.statusSafetyCheck == 3 &&
      formData.percentSafetyCheck >= 0 &&
      formData.percentSafetyCheck <= 100 &&
      formData.percentSafetyCheck != project.safetycheck_percent
    ) {
      formDataToSend.append("safetycheck_percent", formData.percentSafetyCheck);
    }
    if (
      formData.statusTestRun == 2 &&
      formData.percentTestRun >= 0 &&
      formData.percentTestRun <= 100 &&
      formData.percentTestRun != project.testrun_percent
    ) {
      formDataToSend.append("testrun_percent", formData.percentTestRun);
    } else if (
      formData.statusTestRun == 3 &&
      formData.percentTestRun >= 0 &&
      formData.percentTestRun <= 100 &&
      formData.percentTestRun != project.testrun_percent
    ) {
      formDataToSend.append("testrun_percent", formData.percentTestRun);
    }
    if (formData.comment?.trim()) {
      formDataToSend.append("comment", formData.comment.trim());
    }
    formDataToSend.append("updateby", formData.username);
    //console.log("📌 FormData ที่ถูกส่ง:");
    // for (let pair of formDataToSend.entries()) {
    //   console.log(
    //     pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
    //   );
    // }
    let options = {
      method: "POST",
      headers: {
        Authorization: "4b885abc7461db4d76dc4f783f7726b3",
      },
      body: formDataToSend,
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          errorDetails.error || `HTTP error! Status: ${response.status}`
        );
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
      statusElectrical: formData.statusElectrical,
      statusMechanic: formData.statusMechanic,
      statusInstall: formData.statusInstall,
      statusSafetyCheck: formData.statusSafetyCheck,
      statusTestRun: formData.statusTestRun,
      percentElectrical: formData.percentElectrical,
      percentMechanic: formData.percentMechanic,
      percentInstall: formData.percentInstall,
      percentSafetyCheck: formData.percentSafetyCheck,
      percentTestRun: formData.percentTestRun,
      comment: formData.comment,
      username: formData.username,
    };
    //console.log("📋 FormData ก่อนส่ง:", updatedFormData);
    closePopup();
    Swal.fire({
      title: "Update Project",
      text: "ยืนยันการอัปเดตข้อมูลหรือไม่?",
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
            <button className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white absolute right-1 top-1">
              ✕
            </button>
          </form>
          <div className="flex flex-col">
            <h3 className="text-sm badge bg-[#FFB200]/60 text-black border-none flex flex-row gap-1">
              <span className="font-bold">Workbom No: </span>
              {formData.workbomNo}
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
              {/** Electrical Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusElectrical == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-electrical"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Electrical (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"
                  id="percent-electrical"
                  type="number"
                  value={
                    formData.percentElectrical === null
                      ? ""
                      : formData.percentElectrical
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentElectrical: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentElectrical: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** Mechanic Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusMechanic == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-mechanic"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Mechanic (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"
                  id="percent-mechanic"
                  type="number"
                  value={
                    formData.percentMechanic === null
                      ? ""
                      : formData.percentMechanic
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentMechanic: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentMechanic: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>

              {/** Install Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusInstall == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-install"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Install (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"
                  id="percent-install"
                  type="number"
                  value={
                    formData.percentInstall === null
                      ? ""
                      : formData.percentInstall
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentInstall: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      percentInstall: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** SafetyCheck Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusSafetyCheck == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-safetycheck"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Safety Check (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"
                  id="percent-safetycheck"
                  type="number"
                  value={
                    formData.percentSafetyCheck === null
                      ? ""
                      : formData.percentSafetyCheck
                  }
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentSafetyCheck: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentSafetyCheck: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** TestRun Percent **/}
              <div
                className={`flex flex-col items-center min-w-[100px] max-w-[180px] flex-grow ${
                  formData.statusTestRun == 1 ? "hidden" : "block"
                }`}
              >
                <label
                  htmlFor="percent-testrun"
                  className="text-sm font-semibold text-center w-full px-2 tracking-wide whitespace-nowrap"
                >
                  Test Run (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0 p-2 text-center"
                  id="percent-testrun"
                  type="number"
                  value={
                    formData.percentTestRun === null
                      ? ""
                      : formData.percentTestRun
                  }
                  hidden={formData.statusTestRun == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentTestRun: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentTestRun: numericValue,
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
export default UpdateAutomationProjectPopup;

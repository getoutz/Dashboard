import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const UpdateProgrammerProjectPopup = forwardRef(({ project }, ref) => {
  console.log("project", project)
  // let dataLogFile = project?.project_details_logs;
  // console.log(dataLogFile, "Log Log")
  const [formData, setFormData] = useState({
    workbomId: 0,
    isOpenPopup: false,
    selectedStatus: "",
    isRowPopupOpen: false,
    isDetailOpen: false,
    statusConceptProgrammer: 1,
    statusBackup: 1,
    statusProgram: 1,
    statusManual: 1,
    statusSaveFile: 1,
    percentConceptProgrammer: 0,
    percentBackup: 0,
    percentProgram: 0,
    percentManual: 0,
    percentSaveFile: 0,
    file: null,
    logFile: null,
    comment: "",
    username: "",
    dragActive: false,
  });
  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);
  const commentRef = useRef(null);
  const openPopup = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };
  const closePopup = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    // ✅✅reset data when close popup
    setFormData((prevData) => ({
      ...prevData,
      selectedStatus: "",
      file: null,
      comment: "",
    }));
  };
  useImperativeHandle(ref, () => ({
    openPopup,
    closePopup,
  }));

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['.jpg', '.png', '.pdf', '.zip', '.rar'];
      const fileName = selectedFile.name.toLowerCase();
      const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
      if (!isValidExtension) {
        closePopup();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "กรุณาอัปโหลดเฉพาะไฟล์ .jpg, .png, .pdf, .zip, .rar!",
        }).then(() => {
          openPopup(); // เปิด popup update กลับมาอีกครั้ง
        });
        return;
      }
  
      const maxSizeInMB = 100;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        closePopup();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `ไฟล์มีขนาดเกิน ${maxSizeInMB} MB!`,
        }).then(() => {
          openPopup(); // เปิด popup update กลับมาอีกครั้ง
        });
        return;
      }
      openPopup(); // กรณีผ่านเงื่อนไขทั้งหมด
      // add file in formData
      setFormData((prevData) => ({ ...prevData, file: selectedFile }));
      //console.log("File selected:", selectedFile.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setFormData((prevFormData) => ({ ...prevFormData, dragActive: true }));
  };

  const handleDragLeave = () => {
    setFormData((prevFormData) => ({ ...prevFormData, dragActive: false }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFormData((prevFormData) => ({ ...prevFormData, dragActive: false }));

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        closePopup();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "กรุณาอัปโหลดเฉพาะไฟล์ PDF!",
        }).then(() => {
          closePopup();
        });
        return;
      }
      //check file size
      const maxSizeInMB = 100;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (droppedFile.size > maxSizeInBytes) {
        closePopup();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `ไฟล์มีขนาดเกิน ${maxSizeInMB} MB!`,
        }).then(() => {
          closePopup();
        });
        return;
      }
      setFormData((prevFormData) => ({ ...prevFormData, file: droppedFile }));
      closePopup();
      Swal.fire({
        icon: "success",
        title: "Upload File",
        text: "อัปโหลดไฟล์สำเร็จ!",
      }).then(() => {
        closePopup();
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); //open input[type="file"]
  };

  //Props data from design table page
  useEffect(() => {
    //console.log("Received project in UpdateProjectPopup:", project);
    let dataLogFile = project?.project_details_logs || [];
    //console.log(dataLogFile, "Log Log 0");
    //check structure of logFile
    if (Array.isArray(dataLogFile) && dataLogFile.length > 0) {
      dataLogFile.forEach((log, index) => {
        //console.log(`Log ${index + 1}:`, log);
      });
    } else {
      console.log("No logs found in project_details_logs");
    }
    if (project) {
      setFormData((prevData) => ({
        ...prevData,
        workbomId: project.workbom_id,
        workbomNo: project?.workbom_no,
        statusConceptProgrammer: project.concept_status,
        statusBackup: project.backup_status,
        statusProgram: project.program_status,
        statusManual: project.manual_status,
        statusSaveFile: project.savefile_status,
        percentConceptProgrammer: project.concept_percent,
        percentBackup: project.backup_percent,
        percentProgram: project.program_percent,
        percentManual: project.manual_percent,
        percentSaveFile: project.savefile_percent,
        logFile: dataLogFile.map((log) => log.log_file), //keep log_file of all log
      }));
      console.log(
        dataLogFile.map((log) => log.log_file),
        "Log Files"
      );
    }
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        username: session.username,
      }));
    }
  }, [project]);

  //Update Function
  const handleUpdatePopup = async (event) => {
    event.preventDefault();
    //close popup when selected status
    closePopup();
    const formDataToSend = new FormData();
    formDataToSend.append("workbomid", formData.workbomId);
    if (
      (formData.statusConceptProgrammer == 2 &&
      (formData.percentConceptProgrammer >= 0 &&
      formData.percentConceptProgrammer <= 100)) &&
      (formData.percentConceptProgrammer != project.concept_percent)
    ) {
      formDataToSend.append("concept_percent", formData.percentConceptProgrammer);
    } else if ((formData.statusConceptProgrammer == 3 &&
      (formData.percentConceptProgrammer >= 0 &&
      formData.percentConceptProgrammer <= 100)) &&
  (formData.percentConceptProgrammer != project.concept_percent)) {
        formDataToSend.append("concept_percent", formData.percentConceptProgrammer);
      }
    if (
      (formData.statusBackup == 2 &&
      (formData.percentBackup >= 0 &&
      formData.percentBackup <= 100)) &&
      (formData.percentBackup != project.backup_percent)
    ) {
      formDataToSend.append("backup_percent", formData.percentBackup);
    } else if ((formData.statusBackup == 3 &&
      (formData.percentBackup >= 0 &&
      formData.percentBackup <= 100)) &&
  (formData.percentBackup != project.backup_percent)) {
        formDataToSend.append("backup_percent", formData.percentBackup);
      }
    if (
      (formData.statusProgram == 2 &&
      (formData.percentProgram >= 0 &&
      formData.percentProgram <= 100)) &&
      (formData.percentProgram != project.program_percent)
    ) {
      formDataToSend.append("program_percent", formData.percentProgram);
    } else if ((formData.statusProgram == 3 &&
      (formData.percentProgram >= 0 &&
      formData.percentProgram <= 100)) &&
  (formData.percentProgram != project.program_percent)) {
        formDataToSend.append("program_percent", formData.percentProgram);
      }
    if (
      (formData.statusManual == 2 &&
      (formData.percentManual >= 0 &&
      formData.percentManual <= 100)) &&
      (formData.percentManual != project.manual_percent)
    ) {
      formDataToSend.append("manual_percent", formData.percentManual);
    } else if ((formData.statusManual == 3 &&
      (formData.percentManual >= 0 &&
      formData.percentManual <= 100)) &&
  (formData.percentManual != project.manual_percent)) {
        formDataToSend.append("manual_percent", formData.percentManual);
      }
    if (
      (formData.statusSaveFile == 2 &&
      (formData.percentSaveFile >= 0 &&
      formData.percentSaveFile <= 100)) &&
      (formData.percentSaveFile != project.savefile_percent)
    ) {
      formDataToSend.append("savefile_percent", formData.percentSaveFile);
    } else if ((formData.statusSaveFile == 3 &&
      (formData.percentSaveFile >= 0 &&
      formData.percentSaveFile <= 100)) &&
  (formData.percentSaveFile != project.savefile_percent)) {
        formDataToSend.append("savefile_percent", formData.percentSaveFile);
      }
    if (formData.comment) {
      formDataToSend.append("comment", formData.comment);
    }
    if (formData.username) {
      formDataToSend.append("updateby", formData.username);
    }
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    console.log("FormDataToSend before sending:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }
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
          const response = await fetch("http://192.168.1.150/updateprojectprogram", {
            method: "POST",
            body: formDataToSend,
            headers: {
              Authorization: "5c4af0b68da06ee3399e4a9362538c6c",
            },
          });

           if (response.status === 200) {
          closePopup();
          Swal.fire({
            icon: "success",
            title: "Update Project",
            text: "อัปเดตข้อมูลสำเร็จ!",
          }).then(() => {
            sessionStorage.setItem("lastPage", window.location.pathname);
            window.location.reload();
          });
        } else {
          // ถ้า status ไม่ใช่ 200
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: data.message || "ไม่สามารถอัปเดตข้อมูลได้",
          }).then(() => {
            openPopup(); // เปิด popup กลับในกรณี error
          });
        }
        } catch (error) {
          console.error("❌ API Error:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        }).then(() => {
          openPopup(); // เปิด popup กลับเมื่อเกิด exception
        });
        }
      }  else {
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
        <div className="modal-box bg-white text-black overflow-visible w-[80vw] max-w-[550px] px-10 max-h-[90vh] flex flex-col overflow-y-auto pr-20 rounded-md">
          <form method="dialog">
            <button
              className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white absolute right-1 top-1"
            >
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-3">
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
            <div className="flex flex-row justify-start gap-5">
              {/** Concept Percent **/}
              <div className="flex flex-col">
                <label
                  htmlFor="percent-concept"
                  hidden={formData.statusConceptProgrammer == 1}
                >
                  Concept (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0"
                  id="percent-concept"
                  type="number"
                  value={
                    formData.percentConceptProgrammer === null
                      ? ""
                      : formData.percentConceptProgrammer
                  } 
                  hidden={formData.statusConceptProgrammer == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentConceptProgrammer: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentConceptProgrammer: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** Backup Percent **/}
              <div className="flex flex-col items-start">
                <label htmlFor="percent-backup" hidden={formData.statusBackup == 1}>
                  Backup (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0"
                  id="percent-backup"
                  type="number"
                  value={formData.percentBackup === null ? "" : formData.percentBackup}
                  hidden={formData.statusBackup == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentBackup: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentBackup: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** Program Percent **/}
              <div className="flex flex-col items-start">
                <label htmlFor="percent-program" 
                hidden={formData.statusProgram == 1}
                >
                  Program (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0"
                  id="percent-program"
                  type="number"
                  value={formData.percentProgram === null ? "" : formData.percentProgram}
                  hidden={formData.statusProgram == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value; 
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentProgram: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      percentProgram: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** Manual Percent **/}
              <div className="flex flex-col items-start">
                <label htmlFor="percent-manual" hidden={formData.statusManual == 1}>
                  Manual (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0"
                  id="percent-manual"
                  type="number"
                  value={formData.percentManual === null ? "" : formData.percentManual}
                  hidden={formData.statusManual == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentManual: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentManual: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
              {/** Save file Percent **/}
              <div className="flex flex-col items-start">
                <label htmlFor="percent-savefile" hidden={formData.statusSaveFile == 1}>
                  Save file (%)
                </label>
                <input
                  className="w-full border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none focus:ring-0"
                  id="percent-savefile"
                  type="number"
                  value={formData.percentSaveFile === null ? "" : formData.percentSaveFile}
                  hidden={formData.statusSaveFile == 1}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setFormData((prevData) => ({
                        ...prevData,
                        percentSaveFile: null,
                      }));
                      return;
                    }
                    const numericValue = Math.max(
                      0,
                      Math.min(100, Number(inputValue))
                    );

                    setFormData((prevData) => ({
                      ...prevData,
                      percentSaveFile: numericValue,
                    }));
                  }}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            {/** File Upload Section **/}
            <div
              className={`flex flex-col gap-5 ${
                formData.dragActive ? "border-dashed bg-gray-200" : "bg-white"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label className="text-base font-bold text-[#45474B] text-left">
                File Upload
              </label>
              <span className="text-red-600 font-NotoSansThai">
                * แนบไฟล์ .jpg .png .pdf .zip .rar ได้ไม่เกิน 100 MB/1 ไฟล์
              </span>
              <div
                className="btn border-2 border-dashed border-[#E4C087] w-full h-full py-5 hover:bg-[#FFF8DB] hover:border-[#DEAC80] bg-[#FEF9F2]"
                onClick={handleButtonClick}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="text-[#B99470]">
                    {formData.file ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-file-earmark-fill" viewBox="0 0 23 23">
                      <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
                    </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-upload"
                        viewBox="0 0 16 16"
                      >
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                      </svg>
                    )}
                  </div>
                  {formData.dragActive ? (
                    "Drop the file here..."
                  ) : formData.file ? (
                    <ul>
                      <li>{formData.file.name}</li>
                    </ul>
                  ) : (
                    "Choose file or drag and drop here"
                  )}
                </div>
                <input
                  type="file"
                  accept=".jpg,.png,.pdf,.zip,.rar"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row gap-1 font-semibold text-[#9AA6B2] text-[14px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clock-history"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                  </svg>
                  history
                </div>
                {Array.isArray(formData.logFile) &&
                formData.logFile.length > 0 ? (
                  formData.logFile.slice(0, 5).map((log, index) => {
                    if (typeof log !== "string") return null; //prevent error if log is not string
                    const fileName = log.split("/").pop(); //pull file name from URL
                    return (
                      <div
                        key={index}
                        className="text-[#9AA6B2] hover:text-orange-500 underline transition duration-300 text-[13px]"
                      >
                        <a href={log} target="_blank" rel="noopener noreferrer">
                          {fileName}
                        </a>
                        <br />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No files available</p>
                )}
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
              ref={commentRef}
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
export default UpdateProgrammerProjectPopup;

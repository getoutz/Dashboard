import axios from "axios";
import Swal from "sweetalert2";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PurchaseRowTablePopup from "../components/PurchaseRowTablePopup";
// import UpdateProjectPopup from "../components/UpdateProjectPopup";
import { useNavigate } from "react-router-dom";

export function PurchaseTable(props) {
  const location = useLocation(); // ใช้ hook เพื่อตรวจสอบเส้นทางปัจจุบัน
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // ตั้งเวลา currentDate ให้เป็น 00:00:00
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
  };
  const navigate = useNavigate();
  const goToEditProject = () => {
    navigate("/editProject");
  };
  const [formData, setFormData] = useState({
    showProjectList: [],
    searchText: "",
    selectedProject: null,
    isRowPopupOpen: false,
    isOpenPopup: false,
    selectedWorkbomNo: "",
    selectedProjectName: "",
    selectedProjectOwner: "",
    selectedProjectPersonResponsible: [],
    selectedStatusConcept: 1,
    selectedStatus3D: 1,
    selectedStatus2D: 1,
    selectedStatusPR: 1,
    selectedPercentConcept: 0,
    selectedPercent3D: 0,
    selectedPercent2D: 0,
    selectedPercentPR: 0,
    selectedDeadlineConcept: null,
    selectedDeadline3D: null,
    selectedDeadline2D: null,
    selectedDeadlinePR: null,
    selectedProjectStart: null,
    selectedProjectEnd: null,
    selectedProjectDetail: "",
    username: "",
    session: null,
    activePopup: null, // กำหนดว่า Popup ไหนกำลังเปิด
  });

  const [openRow, setOpenRow] = useState(null); // สถานะสำหรับแถวที่เปิดอยู่

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id)); // สลับสถานะเปิด/ปิดของแถว
  };
  
  const popupAddProjectRef = useRef(null);
  const popupEditProjectRef = useRef(null); // เพิ่ม ref ใหม่สำหรับ EditProject
  const popupUpdateProjectRef = useRef(null);
  const popupRowTableRef = useRef(null);
  const handlePopup = (popupType, action, projectId = null) => {
    const resetPopupState = () => {
      setFormData((prevData) => ({
        ...prevData,
        activePopup: null,
        selectedProject: null,
      }));
    };
  
    if (action === "open") {
      // ปิด Popup ปัจจุบันถ้ามี
      if (formData.activePopup) {
        switch (formData.activePopup) {
          case "RowTable":
            popupRowTableRef.current?.closePopup();
            break;
          case "EditProject":
            popupEditProjectRef.current?.closePopup();
            break;
          case "UpdateProject":
            popupUpdateProjectRef.current?.closePopup();
            break;
          default:
            console.error("Unknown popup type.");
        }
      }
  
      // เปิด Popup ใหม่
      const selected = formData.showProjectList.find(
        (project) => project.workbom_id === projectId
      );
      setFormData((prevData) => ({
        ...prevData,
        selectedProject: selected,
        activePopup: popupType,
      }));
  
      switch (popupType) {
        case "RowTable":
          popupRowTableRef.current?.openPopup();
          break;
        case "EditProject":
          popupEditProjectRef.current?.openPopup();
          break;
        case "UpdateProject":
          popupUpdateProjectRef.current?.openPopup();
          break;
        default:
          console.error("Unknown popup type.");
      }
    } else if (action === "close") {
      // ปิด Popup ตามประเภทที่ระบุ
      switch (popupType) {
        case "RowTable":
          popupRowTableRef.current?.closePopup();
          break;
        case "EditProject":
          popupEditProjectRef.current?.closePopup();
          break;
        case "UpdateProject":
          popupUpdateProjectRef.current?.closePopup();
          break;
        default:
          console.error("Unknown popup type.");
      }
      resetPopupState();
    }
  };

  // // ฟังก์ชันสำหรับเปิด Popup
  // const handleRowTableOpenPopup = (event, projectId) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   // หาก skipOpenPopup เป็น true ให้หยุดการทำงาน
  //   if (formData.skipOpenPopup) {
  //     console.log("Cannot open Row Table Popup because Edit Popup is active.");
  //     return;
  //   }

  //   const selected = formData.showProjectList.find(
  //     (project) => project.workbom_id === projectId
  //   );

  //   if (selected) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       selectedProject: selected,
  //     }));

  //     popupRowTableRef.current?.openPopup(); // เปิด Row Table Popup
  //   }
  // };

  // const handleRowTableClosePopup = () => {
  //   popupRowTableRef.current?.closePopup(); // ปิด Row Table Popup
  // };

  // const handleEditModalOpen = (event, projectId) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const selected = formData.showProjectList.find(
  //     (project) => project.workbom_id === projectId
  //   );

  //   if (selected) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       selectedProject: selected,
  //       skipOpenPopup: true, // ตั้งค่าสถานะเพื่อป้องกันการเปิด Row Table Popup
  //     }));

  //     if (popupEditProjectRef.current) {
  //       popupEditProjectRef.current.openPopup(); // เปิด Edit Project Popup
  //     }
  //   }
  // };

  // const handleEditModalClose = () => {
  //   popupEditProjectRef.current?.closePopup(); // ปิด Edit Popup

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     skipOpenPopup: false, // รีเซ็ตค่าเพื่อให้ Row Table Popup ทำงานได้
  //   }));
  // };

  const handleConfirmSuccessPopup = async (event, workbomId) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Button clicked with WorkBOM ID:", workbomId); // ตรวจสอบว่าโค้ดเข้ามาถึงจุดนี้หรือไม่
    
    Swal.fire({
      title: "Confirm Status Success",
      text: `ยืนยันการเปลี่ยนแปลงสถานะ Success?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirm result", workbomId);
        updateStatusSuccess(workbomId); // ส่ง workbomId ไปที่ updateStatusSuccess
        // หากผู้ใช้กด "ยืนยัน"
        Swal.fire({
          title: "Confirm Success!",
          text: `ยืนยันสถานะ Success แล้ว`,
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then(() => {
          // สามารถเพิ่ม logic เพิ่มเติมได้ เช่น reload หน้า
          console.log(`Confirmed success for WorkBOM ID: ${workbomId}`);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // หากผู้ใช้กด "ยกเลิก"
        Swal.fire({
          title: "Cancelled!",
          text: "ยกเลิกการยืนยันสถานะ Success",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    });
  };
  

  const updateStatusSuccess = async (workbomId) => {
    console.log("Update Success API", workbomId);
    try {
      const url = `http://192.168.1.150/updatesuccess`;
      let projectData = {
        workbomid: workbomId,
        confirm_success: "confirm",
        updateby: formData.username.username,
      };

      const result = await axios.post(url, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "a876ce4174303915965d3e9259c87eb7",
        },
      });

      if (result.status === 200) {
        Swal.fire({
          title: "ยืนยันสถานะ Success สำเร็จ!",
          text: "สถานะ Success ถูกยืนยันสำเร็จ",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        throw new Error("Error: Unable to update status");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        title: "Error",
        text: "ไม่สามารถยืนยันสถานะ Success ได้ กรุณาลองใหม่",
        icon: "error",
      });
    }
  };

  const handleUpdateModalOpen = (event, projectId) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Selected Project ID:", projectId);
    const selected = formData.showProjectList.find(
      (project) => project.workbom_id === projectId
    );

    console.log("Selected Project Data:", selected);

    if (selected) {
      setFormData((prevData) => ({
        ...prevData,
        selectedProject: selected,
        skipOpenPopup: true, // ป้องกันการเปิด Row Table Popup พร้อมกัน
      }));

      if (popupUpdateProjectRef.current) {
        // ปิด Edit Popup ถ้าเปิดอยู่
        popupUpdateProjectRef.current.openPopup();
      }
    }
  };

  const handleUpdateModalClose = () => {
    popupUpdateProjectRef.current?.closePopup();

    setFormData((prevData) => ({
      ...prevData,
      selectedProject: null,
      skipOpenPopup: false,
    }));
  };
  // ตั้งค่า username จาก session
  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevData) => ({
        ...prevData, // Keep all previous data
        username: session, // Update only the username field
        session: session,
      }));
      console.log(session);
    } else {
      throw new Error("No userSession");
    }
  }, []);

  const checkPosition = (allowedPositions) => {
    return allowedPositions.includes(formData.session.position);
  };

  const checkPermission = (allowedPermissions) => {
    return allowedPermissions.includes(formData.session.permission);
  };

  const getProjectList = async () => {
    console.log();
    // ตรวจสอบว่า path เป็น /purchase/myproject หรือไม่
    const url =
      location.pathname === "/purchase/myproject"
        ? checkPermission(["Admin"]) || checkPosition(["Manager"])
          ? "http://192.168.1.150/viewlistproject"
          : `http://192.168.1.150/viewlistproject?user=${formData.username.username}`
        : "http://192.168.1.150/viewlistproject";
    console.log(url, "URL Check");
    console.log(formData.username, "Check");
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "cd4866e0bf84301854aa711e7ae17f8e",
        },
      });
      setFormData((prevData) => ({
        ...prevData,
        showProjectList: result.data.data,
      }));
      console.log(result.data.data);
    } catch (error) {
      console.error("Error fetching project list:", error);
    }
  };

  // เมื่อ username ถูกตั้งค่าแล้ว ให้เรียก getProjectList
  useEffect(() => {
    if (formData.username) {
      getProjectList();
    }
  }, [formData.username]);

  const filteredProject = formData.showProjectList.filter((project) => {
    const searchText = formData.searchText.toLowerCase();
    const matchesText =
      (project.workbom_no &&
        project.workbom_no.toLowerCase().includes(searchText.toLowerCase())) ||
      (project.project_name &&
        project.project_name
          .toLowerCase()
          .includes(searchText.toLowerCase())) ||
      (Array.isArray(project.project_person_responsible)
        ? project.project_person_responsible.some(
            (person) =>
              person && person.toLowerCase().includes(searchText.toLowerCase())
          )
        : project.project_person_responsible &&
          project.project_person_responsible
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
      (project.project_owner &&
        project.project_owner.toLowerCase().includes(searchText.toLowerCase()));
    return matchesText;
  });

  return (
    <div className="mt-[-35px] col-span-full xl:col-span-6 bg-white shadow-sm rounded-xl font-Quicksand">
      <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 text-xl font-LexendDeca">
          {props.TitleTable}
        </h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center p-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 w-full h-full pl-10 pr-4 py-[11px] border border-gray-300 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="Search.."
                value={formData.searchText}
                onChange={(event) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    searchText: event.target.value,
                  }))
                }
              />
            </div>
          </form>    
        </div>
      </header>
      <div className="p-3 overflow-x-auto font-medium h-[calc(100vh-200px)]">
        <div className="relative h-full overflow-y-auto">
          <table className="table-auto w-full">
            <thead className="sticky top-0 z-10 font-bold uppercase text-xs text-center text-white bg-[#A0937D]">
              <tr>
                <th className="p-2 whitespace-nowrap">Workbom No.</th>
                <th className="p-2 whitespace-nowrap">Project Name</th>
                <th className="p-2 whitespace-nowrap">Owner</th>
                <th className="p-2 whitespace-nowrap">Customer</th>
                <th className="p-2 whitespace-nowrap">Due Date</th>
                {location.pathname == "/purchase/manageproject" && (
                <th className="p-2 whitespace-nowrap">Actions</th>)}
              </tr>
            </thead>
            <tbody className="font-medium text-sm divide-y divide-gray-100">
              {filteredProject.length > 0 ? (
                filteredProject.map((project, idx) => (
                  <React.Fragment key={project.workbom_id}>
                    {/* แถวหลัก */}
                    <tr
                      onClick={() => toggleRow(project.workbom_id)}
                      className={`cursor-pointer text-center ${
                        openRow === project.workbom_id
                          ? "bg-[#FFF5D7] text-[#543A14]" // สีพื้นหลังและข้อความเมื่อเปิด collapse
                          : idx % 2 === 0
                          ? "bg-white text-[#C58940]" // สีพื้นหลังสำหรับแถวคู่
                          : "bg-[#F7F4EA] text-[#61481C]" // สีพื้นหลังสำหรับแถวคี่
                      }`}
                    >
                      <td className="p-2 whitespace-nowrap">
                        {project.workbom_no}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.project_name}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.project_owner}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.customer}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.start_timeline} - {project.end_timeline}
                      </td>
                      {location.pathname == "/purchase/manageproject" && (
                      <td className="p-2 whitespace-nowrap">
                        <button className="shadow w-auto px-3 h-[35px] bg-[#E8B86D]/90 rounded-full hover:bg-[#E0A75E] focus:ring-2 focus:outline-none focus:ring-[#A67B5B] text-white">
                          Edit
                        </button>
                      </td>)}
                    </tr>

                    {/* ส่วน Collapse */}
                    {openRow === project.workbom_id && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <div className="collapse rounded-none bg-[#F1F0E8] p-4">
                            <div className="text-lg font-medium">
                              Details for {project.workbom_no}
                            </div>
                            <div className="mt-2">
                            <table className="table text-base">
                  <thead>
                    <tr className="bg-[#97E7E1]/50 text-[#484D51]/90 w-full h-9">
                      <th className="px-0 py-1 text-center border border-[#C0DBEA]">
                        PO Code
                      </th>
                      <th className="px-0 py-1 text-center border border-[#C0DBEA]">
                        Maker
                      </th>
                      <th className="px-0 py-0 text-center border border-[#C0DBEA]">
                        Delivery
                      </th>
                      <th className="px-0 py-1 text-center border border-[#C0DBEA]">
                        Receive Date
                      </th>
                      <th className="px-0 py-1 text-center border border-[#C0DBEA]">
                        Receive
                      </th>
                      {location.pathname === "/purchase/manageproject" && (
                      <th className="px-0 py-1 text-center border border-[#C0DBEA]">
                        Actions
                      </th>
)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-[#C0DBEA] bg-white text-center w-full">
                      <td className="px-1 py-1 border border-[#C0DBEA]">
                        {project.concept_status == 3 &&
                        project.concept_percent == 100 ? (
                          /*** status concept is 3 && percent concept is 100 ***/
                          <div className="flex justify-center items-center text-[#06D001]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : project.concept_status == 2 &&
                          parseDate(project.concept_deadline) >= currentDate &&
                          project.concept_percent >= 0 &&
                          project.concept_percent <= 99 ? (
                          /*** status concept is 2 && deadline concept is not late && percent concept is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FFB200]">
                            {/*** icon clock ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-clock-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            </svg>
                            {/******************/}
                          </div>
                        ) : project.concept_status == 2 &&
                          parseDate(project.concept_deadline) < currentDate &&
                          project.concept_percent >= 0 &&
                          project.concept_percent <= 99 ? (
                          /*** status concept is 2 && deadline concept is late && percent concept is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FF4545]">
                            {/*** icon fire ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-fire"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
                            </svg>
                            {/******************/}
                          </div>
                        ) : project.concept_status == 1 ? (
                          /*** status concept is 1 ***/
                          <div className="flex justify-center items-center text-[#5AB2FF]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                            error
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-1">
                        {project.concept_status == 1 ? (
                          /*** status concept is 1 ***/
                          <div className="flex justify-center items-center text-[#5AB2FF]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : project.concept_status == 2 &&
                          parseDate(project.concept_deadline) >= currentDate ? (
                          /*** status concept is 2 && concept deadline is not late ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.concept_percent >= 0 &&
                                  project.concept_percent <= 99 &&
                                  project.concept_percent,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.concept_percent}
                            </div>
                          </div>
                        ) : project.concept_status == 2 &&
                          parseDate(project.concept_deadline) < currentDate ? (
                          /*** status concept is 2 && concept deadline is late ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.concept_percent >= 0 &&
                                  project.concept_percent <= 99 &&
                                  project.concept_percent,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.concept_percent}
                            </div>
                          </div>
                        ) : project.concept_status == 3 ? (
                          /*** status concept is 3 ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.concept_percent == 100 &&
                                  project.concept_percent,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.concept_percent}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                            error
                          </div>
                        )}
                      </td>

                      <td className="px-1 py-1 border border-[#C0DBEA]">
                        {project.status_3d == 3 && project.percent_3d == 100 ? (
                          /*** status 3d is 3 && percent 3d is 100 ***/
                          <div className="flex justify-center items-center text-[#06D001]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : project.status_3d == 2 &&
                          parseDate(project.deadline_3d) >= currentDate &&
                          project.percent_3d >= 0 &&
                          project.percent_3d <= 99 ? (
                          /*** status 3d is 2 && deadline 3d is not late && percent 3d is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FFB200]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-clock-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            </svg>
                          </div>
                        ) : project.status_3d == 2 &&
                          parseDate(project.deadline_3d) < currentDate &&
                          project.percent_3d >= 0 &&
                          project.percent_3d <= 99 ? (
                          /*** status 3d is 2 && deadline 3d is late && percent 3d is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FF4545]">
                            {/*** icon fire ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-fire"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
                            </svg>
                            {/*****************/}
                          </div>
                        ) : project.status_3d == 1 ? (
                          /*** status 3d is 1 ***/
                          <div className="flex justify-center items-center text-[#5AB2FF]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                            error
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-1">
                        {project.status_3d == 1 ? (
                          /*** status 3d is 1 ***/
                          <div className="flex justify-center items-center my-3 text-[#5AB2FF]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : project.percent_3d >= 0 &&
                          project.percent_3d <= 99 &&
                          project.status_3d == 2 &&
                          parseDate(project.deadline_3d) >= currentDate ? (
                          /*** status 3d is 2 && 3d deadline is not late ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.percent_3d >= 0 &&
                                  project.percent_3d <= 99 &&
                                  project.percent_3d,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.percent_3d}
                            </div>
                          </div>
                        ) : project.percent_3d >= 0 &&
                          project.percent_3d <= 99 &&
                          project.status_3d == 2 &&
                          parseDate(project.deadline_3d) < currentDate ? (
                          /*** status 3d is 2 && 3d deadline is late ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.percent_3d >= 0 &&
                                  project.percent_3d <= 99 &&
                                  project.percent_3d,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.percent_3d}
                            </div>
                          </div>
                        ) : project.status_3d == 3 ? (
                          /*** status 3d is 3 ***/
                          <div className="flex justify-center items-center">
                            <div
                              className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                              style={{
                                "--value":
                                  project.percent_3d == 100 &&
                                  project.percent_3d,
                                "--size": "2rem",
                                overflow: "hidden",
                              }}
                              role="progressbar"
                            >
                              {project.percent_3d}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                            error
                          </div>
                        )}
                      </td>
                      {/* 2d */}
                      <td className="px-1 py-1 border border-[#C0DBEA]">
                        {project.status_2d == 3 && project.percent_2d == 100 ? (
                          /*** status 2d is 3 && percent 2d is 100 ***/
                          <div className="flex justify-center items-center text-[#06D001]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/*********************/}
                          </div>
                        ) : project.status_2d == 2 &&
                          parseDate(project.deadline_2d) >= currentDate &&
                          project.percent_2d >= 0 &&
                          project.percent_2d <= 99 ? (
                          /*** status 2d is 2 && deadline 2d is not late && percent 2d is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FFB200]">
                            {/*** icon clock ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-clock-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            </svg>
                            {/*****************/}
                          </div>
                        ) : project.status_2d == 2 &&
                          parseDate(project.deadline_2d) < currentDate &&
                          project.percent_2d >= 0 &&
                          project.percent_2d <= 99 ? (
                          /*** status 2d is 2 && deadline 2d is late && percent 2d is 0 to 99 ***/
                          <div className="flex justify-center items-center text-[#FF4545]">
                            {/*** icon fire ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-fire"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15" />
                            </svg>
                            {/*****************/}
                          </div>
                        ) : project.status_2d == 1 ? (
                          /*** status 2d is 1 ***/
                          <div className="flex justify-center items-center text-[#5AB2FF]">
                            {/*** icon success ***/}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-check-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            {/***************/}
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>
                            error
                          </div>
                        )}
                      </td>
                      {location.pathname == "/purchase/manageproject" ? (
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex flex-row justify-center gap-3">
                          {/* Edit button */}
                          
                            <button
                            //onClick={goToEditProject}
                              className="shadow w-auto px-3 h-[35px] bg-[#CB9DF0] rounded-full hover:bg-[#E0A75E] focus:ring-2 focus:outline-none focus:ring-[#A67B5B] text-white flex flex-row justify-center items-center gap-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                />
                              </svg>
                              Receive
                            </button>
                          
                          {/* Edit Popup */}
                          {/* <EditProjectPopup
                            project={formData.selectedProject}
                            ref={popupEditProjectRef}
                            onClose={() => {
                              popupEditProjectRef.current?.closePopup();
                              resetPopupState(); // รีเซ็ตสถานะเมื่อปิด Popup
                            }}
                          /> */}  
                          </div> 
                          </td>) : null }                   
                    </tr>
                  </tbody>
                </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No project data..
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

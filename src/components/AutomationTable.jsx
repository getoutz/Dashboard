import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import AutomationRowTablePopup from "../components/AutomationRowTablePopup";
import UpdateAutomationProjectPopup from "../components/UpdateAutomationProjectPopup";
import EditAutoNamePopup from "../components/EditAutoNamePopup";
import "react-datepicker/dist/react-datepicker.css";

export function AutomationTable() {
  const location = useLocation();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
  };
  const [formData, setFormData] = useState({
    showProjectList: [],
    searchText: "",
    selectedProject: null,
    isRowPopupOpen: false,
    isOpenPopup: false,
    selectedDueDate: 0,
    username: "",
    session: null,
    activePopup: null, //Set where popup is open
  });

  const popupEditAutoNameRef = useRef(null);
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
      //Close current popup when have current Popup
      if (formData.activePopup) {
        switch (formData.activePopup) {
          case "RowTable":
            popupRowTableRef.current?.closePopup();
            break;
          case "EditAutoName":
            popupEditAutoNameRef.current?.closePopup();
            break;
          case "UpdateProject":
            popupUpdateProjectRef.current?.closePopup();
            break;
          default:
            console.error("Unknown popup type.");
        }
      }
      //Open new popup
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
        case "EditAutoName":
          popupEditAutoNameRef.current?.openPopup();
          break;
        case "UpdateProject":
          popupUpdateProjectRef.current?.openPopup();
          break;
        default:
          console.error("Unknown popup type.");
      }
    } else if (action === "close") {
      // Close popup with type
      switch (popupType) {
        case "RowTable":
          popupRowTableRef.current?.closePopup();
          break;
        case "EditAutoName":
          popupEditAutoNameRef.current?.closePopup();
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

  const handleConfirmSuccessPopup = async (event, workbomId, workbomNo) => {
    event.preventDefault();
    event.stopPropagation();
    //console.log("Button clicked with WorkBOM ID:", workbomId); // ตรวจสอบว่าโค้ดเข้ามาถึงจุดนี้หรือไม่
    Swal.fire({
      title: "Confirm Status Success",
      text: `โปรเจค ${workbomNo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1AACAC",
      cancelButtonColor: "#D8D9DA",
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log("confirm result", workbomId);
        updateStatusSuccess(workbomId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Confirm Success",
          text: "ยกเลิก confirm success",
          icon: "error",
        });
      }
    });
  };

  const updateStatusSuccess = async (workbomId) => {
    //console.log("Update Success API", workbomId);
    try {
      const url = `http://192.168.1.150/updatesuccessauto`;
      let projectData = {
        workbomid: workbomId,
        confirm_success: "confirm",
        updateby: formData.username.username,
      };

      const result = await axios.post(url, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "eb614e6dead13f105edcbb3c52fae656",
        },
      });

      if (result.status === 200) {
        Swal.fire({
          title: "Confirm Success",
          text: "ยืนยันสำเร็จ!",
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
      //console.error("Error updating project:", error);
      Swal.fire({
        title: "Error",
        text: "ไม่สามารถยืนยันสถานะ Success ได้ กรุณาลองใหม่",
        icon: "error",
      });
    }
  };

  //set username from session
  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevData) => ({
        ...prevData, // Keep all previous data
        username: session, // Update only the username field
        session: session,
      }));
      //console.log(session);
    } else {
      throw new Error("No userSession");
    }
  }, []);

  const getProjectList = async () => {
    //console.log("Fetching project list...");
    const sortValue = formData.selectedDueDate; // 0 = Start Date, 1 = End Date
    const url = `http://192.168.1.150/automation_getlistworkbom?sort=${sortValue}`;
    //console.log(url, "URL Check");
    //console.log(sortValue, "Sort Value");
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "7177d6e6774f25da89db0cb5913cf265",
        },
      });
      setFormData((prevData) => ({
        ...prevData,
        showProjectList: result.data.data,
      }));
      //console.log(result.data.data, "Sorted Project List");
    } catch (error) {
      console.error("Error fetching project list:", error);
    }
  };

  useEffect(() => {
    if (formData.username) {
      getProjectList();
    }
  }, [formData.username, formData.selectedDueDate]);

  const filteredProject = Array.isArray(formData.showProjectList)
    ? formData.showProjectList.filter((project) => {
        const searchText = formData.searchText.toLowerCase();
        return (
          (project.workbom_no &&
            project.workbom_no.toLowerCase().includes(searchText)) ||
          (project.name && project.name.toLowerCase().includes(searchText)) ||
          (project.owner && project.owner.toLowerCase().includes(searchText))
        );
      })
    : [];

    const checkPosition = (allowedPositions) => {
      return allowedPositions.includes(formData.session?.position);
    };
  return (
    <div className="mt-[-35px] col-span-full xl:col-span-6 bg-white h-auto shadow-sm rounded-xl font-Quicksand">
      <header className=" px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 text-xl font-LexendDeca">
          Automation Project List
        </h1>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold">Due Date </span>
            {/** Dropdown for sort due date **/}
            <div className="form-control">
              <select
                className="selected w-full h-full lg:px-16 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                value={formData.selectedDueDate}
                onChange={(e) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    selectedDueDate: e.target.value,
                  }));
                }}
              >
                <option value="0">Start date</option>
                <option value="1">End date</option>
              </select>
            </div>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <form className="max-w-md mx-auto">
              <label
                htmlFor="default-search"
                className="text-sm font-bold"
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
                  className="border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 w-full h-full pl-10 pr-4 py-[10px] border border-gray-300 sm:text-sm text-gray-900 placeholder-gray-400"
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
        </div>
      </header>
      <div className="p-3 overflow-x-auto font-medium h-[calc(100vh-200px)]">
        <div className="relative h-full overflow-y-auto">
          <table className="table-auto w-full">
            <thead className="sticky top-0 z-20 font-bold uppercase text-xs text-center text-white bg-[#A0937D]">
              <tr>
                <th className="p-2 whitespace-nowrap">No.</th>
                <th className="p-2 whitespace-nowrap">Workbom No.</th>
                <th className="p-2 whitespace-nowrap">Project Name</th>
                <th className="p-2 whitespace-nowrap">Customer</th>
                <th className="p-2 whitespace-nowrap">Auto/Program/Dev.</th>
                <th className="p-2 whitespace-nowrap">Status</th>
                <th className="p-2 whitespace-nowrap">Timeline</th>
                {location.pathname == "/automation/manageproject" ? (
                  <th className="p-2 whitespace-nowrap">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="font-medium text-sm divide-y divide-gray-100">
              {filteredProject && filteredProject.length > 0 ? (
                filteredProject.map((project, index) => (
                  <React.Fragment key={project.workbom_id}>
                    <tr
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handlePopup("RowTable", "open", project.workbom_id);
                      }}
                      className={`text-center cursor-pointer ${
                        index % 2 === 0
                          ? "bg-white text-[#C58940]"
                          : "bg-[#F7F4EA] text-[#61481C]"
                      }`}
                    >
                      <td className="p-2 whitespace-nowrap">{index + 1} </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.workbom_no}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div
                          className="lg:tooltip lg:tooltip-warning relative"
                          data-tip={project.project_name}
                        >
                          {project.project_name
                            ? project.project_name.slice(0, 20) +
                              (project.project_name.length > 20 ? "..." : "")
                            : ""}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.project_owner}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {Array.isArray(project.project_person_responsible)
                          ? project.project_person_responsible.join(", ")
                          : project.project_person_responsible}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {/** Status Table **/}
                        <div className="overflow-x-auto">
                          <table className="table text-sm">
                            <thead>
                              <tr className="bg-[#97E7E1]/50 text-[#484D51]/90">
                                <th
                                  className="px-0 py-1 text-center border border-[#C0DBEA]"
                                  colSpan="2"
                                >
                                  Electrical
                                </th>
                                <th
                                  className="px-0 py-1 text-center border border-[#C0DBEA]"
                                  colSpan="2"
                                >
                                  Mechanic
                                </th>
                                <th
                                  className="px-0 py-0 text-center border border-[#C0DBEA]"
                                  colSpan="2"
                                >
                                  Install
                                </th>
                                <th
                                  className="px-0 py-1 text-center border border-[#C0DBEA]"
                                  colSpan="2"
                                >
                                  Safety check
                                </th>
                                <th
                                  className="px-0 py-1 text-center border border-[#C0DBEA]"
                                  colSpan="2"
                                >
                                  Test run
                                </th>
                                <th
                                  className="px-0 py-1 text-center border border-[#C0DBEA]"
                                  colSpan="1"
                                >
                                  Success
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border border-[#C0DBEA] bg-white text-center">
                                {/** Electrical Status **/}
                                <td className="px-1 py-1 border border-[#C0DBEA]">
                                  {project.electrical_status == 3 ? (
                                    /** Electrical status = 3 --> Electrical status is success **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/*****************/}
                                    </div>
                                  ) : project.electrical_status == 2 &&
                                    parseDate(project.electrical_deadline) >=
                                      currentDate ? (
                                    /** Electrical status = 2 && Electrical deadline >= currentDate --> Have electrical status and electrical deadline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/****************/}
                                    </div>
                                  ) : project.electrical_status == 2 &&
                                    parseDate(project.electrical_deadline) <
                                      currentDate ? (
                                    /** Electrical status = 2 && Electrical deadline < currentDate --> Have electrical status and electrical deadline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/***************/}
                                    </div>
                                  ) : project.electrical_status == 1 ? (
                                    /** Electrical status = 1 --> No electrical status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Success **/}
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
                                      {/*****************/}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Electrical Percent **/}
                                <td className="px-1 py-1">
                                  {project.electrical_status == 1 ? (
                                    /** Electrical status = 1 --> No electrical status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                  ) : project.electrical_status == 2 &&
                                    parseDate(project.electrical_deadline) >=
                                      currentDate ? (
                                    /** Electrical status = 2 && Electrical deadline >= currentDate --> Have electrical status percent and electrical deadline not late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.electrical_percent >= 0 &&
                                            project.electrical_percent <= 99 &&
                                            project.electrical_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.electrical_percent}
                                      </div>
                                    </div>
                                  ) : project.electrical_status == 2 &&
                                    parseDate(project.electrical_deadline) <
                                      currentDate ? (
                                    /** Electrical status = 2 && Electrical deadline < currentDate --> Have electrical status percent and electrical deadline late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.electrical_percent >= 0 &&
                                            project.electrical_percent <= 99 &&
                                            project.electrical_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.electrical_percent}
                                      </div>
                                    </div>
                                  ) : project.electrical_status == 3 ? (
                                    /** Electrical status = 3 --> Electrical status percent is success **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.electrical_percent == 100 &&
                                            project.electrical_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.electrical_percent}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Mechanic Status **/}
                                <td className="px-1 py-1 border border-[#C0DBEA]">
                                  {project.mechanic_status == 3 ? (
                                    //** Mechanic status = 3 --> Mechanic status is success **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/*****************/}
                                    </div>
                                  ) : project.mechanic_status == 2 &&
                                    parseDate(project.mechanic_deadline) >=
                                      currentDate ? (
                                    /** Mechanic status = 2 && Mechanic deadline >= currentDate --> Have mechanic status and mechanic deadline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/****************/}
                                    </div>
                                  ) : project.mechanic_status == 2 &&
                                    parseDate(project.mechanic_deadline) <
                                      currentDate ? (
                                    /** Mechanic status = 2 && Mechanic deadline < currentDate --> Have mechanic status and mechanic deadline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/***************/}
                                    </div>
                                  ) : project.mechanic_status == 1 ? (
                                    /** Mechanic status = 1 --> No mechanic status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/**********************/}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Mechanic Percent **/}
                                <td className="px-1 py-1">
                                  {project.mechanic_status == 1 ? (
                                    /** Mechanic status = 1 --> No mechanic status **/
                                    <div className="flex justify-center items-center my-3 text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                  ) : project.mechanic_status == 2 &&
                                    parseDate(project.mechanic_deadline) >=
                                      currentDate ? (
                                    /** Mechanic status = 2 && Mechanic deadline >= currentDate --> Have mechanic status percent and mechanic deadline not late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.mechanic_percent >= 0 &&
                                            project.mechanic_percent <= 99 &&
                                            project.mechanic_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.mechanic_percent}
                                      </div>
                                    </div>
                                  ) : project.mechanic_status == 2 &&
                                    parseDate(project.mechanic_deadline) <
                                      currentDate ? (
                                    /** Mechanic status = 2 && Mechanic deadline < currentDate --> Have mechanic status percent and mechanic deadline late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.mechanic_percent >= 0 &&
                                            project.mechanic_percent <= 99 &&
                                            project.mechanic_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.mechanic_percent}
                                      </div>
                                    </div>
                                  ) : project.mechanic_status == 3 ? (
                                    /** Mechanic status = 3 --> Mechanic status percent is success **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.mechanic_percent == 100 &&
                                            project.mechanic_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.mechanic_percent}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Install Status **/}
                                <td className="px-1 py-1 border border-[#C0DBEA]">
                                  {project.program_status == 3 ? (
                                    /** Install status = 3 --> Install status is success **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/******************/}
                                    </div>
                                  ) : project.program_status == 2 &&
                                    parseDate(project.program_deadline) >=
                                      currentDate ? (
                                    /** Install status = 2 && Install deadline >= currentDate --> Have install status and install deadline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/****************/}
                                    </div>
                                  ) : project.program_status == 2 &&
                                    parseDate(project.program_deadline) <
                                      currentDate ? (
                                    /** Install status = 2 && Install deadline < currentDate --> Have install status and install deadline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/***************/}
                                    </div>
                                  ) : project.program_status == 1 ? (
                                    /** Install status = 1 --> No install status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Install Deadline **/}
                                <td className="px-1 py-1">
                                  {project.program_status == 1 ? (
                                    /** Install status = 1 --> No install status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/********************/}
                                    </div>
                                  ) : project.program_status == 2 &&
                                    parseDate(project.program_deadline) >=
                                      currentDate ? (
                                    /** Install status = 2 && Install deadline >= currentDate --> Have install status percent and install deadline not late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.program_percent >= 0 &&
                                            project.program_percent <= 99 &&
                                            project.program_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.program_percent}
                                      </div>
                                    </div>
                                  ) : project.program_status == 2 &&
                                    parseDate(project.program_deadline) <
                                      currentDate ? (
                                    /** Install status = 2 && Install deadline < currentDate --> Have install status percent and install deadline late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.program_percent >= 0 &&
                                            project.program_percent <= 99 &&
                                            project.program_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.program_percent}
                                      </div>
                                    </div>
                                  ) : project.program_status == 3 ? (
                                    /** Install status = 3 --> Install status percent is success **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.program_percent == 100 &&
                                            project.program_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.program_percent}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** SafetyCheck Status **/}
                                <td className="px-1 py-1 border border-[#C0DBEA]">
                                  {project.safetycheck_status == 3 ? (
                                    /** SafetyCheck status = 3 --> SafetyCheck status is success **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/******************/}
                                    </div>
                                  ) : project.safetycheck_status == 2 &&
                                    parseDate(project.safetycheck_deadline) >=
                                      currentDate ? (
                                    /** SafetyCheck status = 2 && SafetyCheck deadline >= currentDate --> Have SafetyCheck status and SafetyCheck deadline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/****************/}
                                    </div>
                                  ) : project.safetycheck_status == 2 &&
                                    parseDate(project.safetycheck_deadline) <
                                      currentDate ? (
                                    /** SafetyCheck status = 2 && SafetyCheck deadline < currentDate --> Have SafetyCheck status and SafetyCheck deadline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/**************/}
                                    </div>
                                  ) : project.safetycheck_status == 1 ? (
                                    /** SafetyCheck status = 1 --> No SafetyCheck status **/
                                    <div className="flex justify-center items-center my-3 text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/********************/}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** SafetyCheck Percent **/}
                                <td className="px-1 py-1">
                                  {project.safetycheck_status == 1 ? (
                                    /** SafetyCheck status = 1 --> No SafetyCheck status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                  ) : project.safetycheck_status == 2 &&
                                    parseDate(project.safetycheck_deadline) >=
                                      currentDate ? (
                                    /** SafetyCheck status = 2 && SafetyCheck deadline >= currentDate --> Have SafetyCheck status percent and SafetyCheck deadline not late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.safetycheck_percent >= 0 &&
                                            project.safetycheck_percent <= 99 &&
                                            project.safetycheck_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.safetycheck_percent}
                                      </div>
                                    </div>
                                  ) : project.safetycheck_status == 2 &&
                                    parseDate(project.safetycheck_deadline) <
                                      currentDate ? (
                                    /** SafetyCheck status = 2 && SafetyCheck deadline < currentDate --> Have SafetyCheck status percent and SafetyCheck deadline late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.safetycheck_percent >= 0 &&
                                            project.safetycheck_percent <= 99 &&
                                            project.safetycheck_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.safetycheck_percent}
                                      </div>
                                    </div>
                                  ) : project.safetycheck_status == 3 ? (
                                    /** SafetyCheck status = 3 --> SafetyCheck status percent is success **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.safetycheck_percent ==
                                              100 &&
                                            project.safetycheck_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.safetycheck_percent}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** TestRun Status **/}
                                <td className="px-1 py-1 border border-[#C0DBEA]">
                                  {project.testrun_status == 3 ? (
                                    /** TestRun status = 3 --> TestRun status is success **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/******************/}
                                    </div>
                                  ) : project.testrun_status == 2 &&
                                    parseDate(project.testrun_deadline) >=
                                      currentDate ? (
                                    /** TestRun status = 2 && TestRun deadline >= currentDate --> Have TestRun status and TestRun deadline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/****************/}
                                    </div>
                                  ) : project.testrun_status == 2 &&
                                    parseDate(project.testrun_deadline) <
                                      currentDate ? (
                                    /** TestRun status = 2 && TestRun deadline < currentDate --> Have TestRun status and TestRun deadline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/***************/}
                                    </div>
                                  ) : project.testrun_status == 1 ? (
                                    /** TestRun status = 1 --> No TestRun status **/
                                    <div className="flex justify-center items-center my-3 text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/*******************/}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** TestRun Percent **/}
                                <td className="px-1 py-1">
                                  {project.testrun_status == 1 ? (
                                    /** TestRun status = 1 --> No TestRun status **/
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/*******************/}
                                    </div>
                                  ) : project.testrun_status == 2 &&
                                    parseDate(project.testrun_deadline) >=
                                      currentDate ? (
                                    /** TestRun status = 2 && TestRun deadline >= currentDate --> Have TestRun status percent and TestRun deadline not late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FFB200] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.testrun_percent >= 0 &&
                                            project.testrun_percent <= 99 &&
                                            project.testrun_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.testrun_percent}
                                      </div>
                                    </div>
                                  ) : project.testrun_status == 2 &&
                                    parseDate(project.testrun_deadline) <
                                      currentDate ? (
                                    /** TestRun status = 2 && TestRun deadline < currentDate --> Have TestRun status percent and TestRun deadline late **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#FF4545] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.testrun_percent >= 0 &&
                                            project.testrun_percent <= 99 &&
                                            project.testrun_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.testrun_percent}
                                      </div>
                                    </div>
                                  ) : project.testrun_status == 3 ? (
                                    /** TestRun status = 3 --> TestRun status percent is success **/
                                    <div className="flex justify-center items-center">
                                      <div
                                        className="radial-progress bg-gray-100 text-[#06D001] text-[10px] border-gray-200 border-2"
                                        style={{
                                          "--value":
                                            project.testrun_percent == 100 &&
                                            project.testrun_percent,
                                          "--size": "2rem",
                                          overflow: "hidden",
                                        }}
                                        role="progressbar"
                                      >
                                        {project.testrun_percent}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center gap-1 text-[#FF4545]">
                                      {/** Icon X **/}
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
                                      {/************/}
                                      error
                                    </div>
                                  )}
                                </td>
                                {/** Success Status **/}
                                <td className="px-2 py-1 border border-[#C0DBEA]">
                                  {project.success_status == 3 ? (
                                    /** Success status = 3 --> Success status is complete **/
                                    <div className="flex justify-center items-center text-[#06D001]">
                                      {/** Icon Success **/}
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
                                      {/******************/}
                                    </div>
                                  ) : project.success_status == 2 &&
                                    parseDate(project.end_timeline) >=
                                      currentDate ? (
                                    /** Success status = 2 && End timeline >= currentDate --> Have success status and end timeline not late **/
                                    <div className="flex justify-center items-center text-[#FFB200]">
                                      {/** Icon Clock **/}
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
                                      {/***************/}
                                    </div>
                                  ) : project.success_status == 2 &&
                                    parseDate(project.end_timeline) <
                                      currentDate ? (
                                    /** Success status = 2 && End timeline < currentDate --> Have success status and end timeline late **/
                                    <div className="flex justify-center items-center text-[#FF4545]">
                                      {/** Icon Fire **/}
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
                                      {/***************/}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center items-center text-[#5AB2FF]">
                                      {/** Icon Check Blue **/}
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
                                      {/********************/}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.start_timeline} - {project.end_timeline}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex flex-row justify-center gap-3">
                          {/** Edit name responsible person in automation project **/}
                          {location.pathname == "/automation/manageproject" && checkPosition(["Supervisor"]) && (
                            /** Enabled Edit name responsible person Button **/
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                // console.log(
                                //   "Opening EditAutoName Popup for",
                                //   project.workbom_id
                                // );
                                handlePopup(
                                  "EditAutoName",
                                  "open",
                                  project.workbom_id
                                );
                              }}
                              className="font-semibold text-xs shadow w-auto px-3 h-[35px] bg-[#A888B5] rounded-full hover:bg-[#CB9DF0] focus:ring-2 focus:outline-none focus:ring-[#DA498D] text-white flex flex-row justify-center items-center gap-1"
                            >
                              {/** Icon Edit Name Button **/}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-people-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                              </svg>
                              {/*************************/}
                              Edit
                            </button>
                          )}
                          {/** Edit name responsible person in automation project **/}
                          <EditAutoNamePopup
                            ref={popupEditAutoNameRef}
                            project={formData.selectedProject} //Send data to edit name popup
                            onClose={() => {
                              if (popupEditAutoNameRef.current) {
                                popupEditAutoNameRef.current.closePopup();
                              }
                              resetPopupState(); //Reset status if open popup
                            }}
                          />
                          {/** Disabled Update Percent & Comment Button **/}
                          {location.pathname == "/automation/manageproject" &&
                          project.success_status == 3 ? (
                            <button
                              className="font-semibold text-xs shadow w-auto px-3 h-[35px] bg-[#C7C8CC]/50 rounded-full text-[#EEEDEB] flex flex-row justify-center items-center gap-1"
                              disabled
                            >
                              {/** Icon Update Button **/}
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
                              {/*************************/}
                              Update
                            </button>
                          ) : location.pathname ===
                            "/automation/manageproject" ? (
                            /** Enabled Update Percent & Comment Button **/
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                handlePopup(
                                  "UpdateProject",
                                  "open",
                                  project.workbom_id
                                );
                              }}
                              className="font-semibold text-xs shadow w-auto px-3 h-[35px] bg-[#00CCDD] rounded-full hover:bg-[#6FDCE3] focus:ring-2 focus:outline-none focus:ring-[#7EA1FF] text-white flex flex-row justify-center items-center gap-1"
                            >
                              {/** Icon Update Button **/}
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
                              {/*************************/}
                              Update
                            </button>
                          ) : null}
                          {/** Update Percent & File & Comment Popup **/}
                          <UpdateAutomationProjectPopup
                            project={formData.selectedProject} //Send data to update popup
                            ref={popupUpdateProjectRef}
                            onClose={() => {
                              popupUpdateProjectRef.current?.closePopup();
                              resetPopupState(); //Reset status if open popup
                            }}
                          />
                          {location.pathname === "/automation/manageproject" &&
                          project.success_status == 2 &&
                          project.electrical_status != 2 &&
                          project.mechanic_status != 2 &&
                          project.program_status != 2 &&
                          project.testrun_status != 2 &&
                          project.safetycheck_status != 2 ? (
                            /** Enabled Confirm Success Button **/
                            <button
                              onClick={(event) =>
                                handleConfirmSuccessPopup(
                                  event,
                                  project.workbom_id,
                                  project.workbom_no
                                )
                              }
                              className="font-semibold text-xs shadow w-auto px-1 h-[35px] bg-[#BFDB38] rounded-full hover:bg-[#D2E603] focus:ring-2 focus:outline-none focus:ring-[#D2FF72] text-white flex flex-row justify-center items-center gap-1"
                            >
                              {/** Icon Confirm **/}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-circle"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                              </svg>
                              {/******************/}
                              Confirm
                            </button>
                          ) : location.pathname ===
                            "/automation/manageproject" ? (
                            /** Disabled Confirm Success Button **/
                            <button
                              onClick={(event) =>
                                handleConfirmSuccessPopup(
                                  event,
                                  project.workbom_id
                                )
                              }
                              className="font-semibold text-xs shadow w-auto px-1 h-[35px] bg-[#C7C8CC]/50 rounded-full text-[#EEEDEB] flex flex-row justify-center items-center gap-1"
                              disabled
                            >
                              {/** Icon Confirm **/}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-circle"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                              </svg>
                              {/******************/}
                              Confirm
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                    {/** Automation project detail popup in table row **/}
                    <AutomationRowTablePopup
                      project={formData.selectedProject} //Send data to table row popup
                      projectId={formData.selectedProject?.workbom_id} //Send projectId from selected project
                      ref={popupRowTableRef}
                      onClose={() => {
                        popupRowTableRef.current?.closePopup();
                        resetPopupState();
                      }}
                    />
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
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

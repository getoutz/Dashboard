import React, { useState, useImperativeHandle, forwardRef } from "react";

const PurchaseRowTablePopup = forwardRef(({ project, onCloseRowTablePopup }, ref) => {
  const [formData, setFormData] = useState({
    isOpenPopup: false,
    isDetailOpen: false,
  });
  const openPopup = (event) => {
    if (event) event.stopPropagation(); // หยุดการส่งต่อ Event
    setFormData((prevData) => ({
      ...prevData,
      isOpenPopup: true,
    }));
  };

  const closePopup = (event) => {
    if (event) event.stopPropagation(); // หยุดการส่งต่อ Event
    setFormData((prevData) => ({
      ...prevData,
      isOpenPopup: false, // ปิดเฉพาะ Row Table Popup
    }));

    if (onCloseRowTablePopup) {
      onCloseRowTablePopup(); // Callback เมื่อ popup ถูกปิด
    }
  };

  // เปิดเผยฟังก์ชัน openPopup และ closePopup ผ่าน ref
  useImperativeHandle(ref, () => ({
    openPopup,
    closePopup,
  }));

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
  };
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // ตั้งเวลา currentDate ให้เป็น 00:00:00
  // console.log("Received Project:", project);
  if (!project) return null;

  const toggleDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      isDetailOpen: !prevData.isDetailOpen, // เปลี่ยนสถานะเปิด/ปิด
    }));
  };

  return (
    <>
      {formData.isOpenPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="max-w-screen-lg bg-white lg:5/6 h-auto lg:h-1/4 p-5 rounded-lg shadow-md max-w-lg w-full">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm badge bg-gray-200 text-black border-none">
                  {project.workbom_no}
                </h3>
                <h3 className="text-sm badge bg-gray-200 text-black border-none">
                  {project.workbom_no}
                </h3>            
                  <h3 className="font-extrabold text-xl text-orange-600">
                    <span>{project.project_name}</span>
                  </h3>
              </div>
              <button
                onClick={(event) => closePopup(event)}
                className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-row">
              <h3 className="font-bold text-sm">
                Due Start:{" "}
                <span className="font-normal text-gray-400 font-NotoSansThai">
                {project.start_timeline}
                </span>
              </h3>
            </div>
            <hr className="my-4" />
            
              {/* status table */}
              
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
      )}
    </>
  );
});
export default PurchaseRowTablePopup;

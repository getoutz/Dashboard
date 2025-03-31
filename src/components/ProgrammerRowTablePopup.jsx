import React, { useState, useImperativeHandle, forwardRef } from "react";

const ProgrammerRowTablePopup = forwardRef(
  ({ project, onCloseRowTablePopup }, ref) => {
    const [formData, setFormData] = useState({
      isOpenPopup: false,
      isDetailOpen: false,
    });
    console.log("Project: ", project);
    const openPopup = (event) => {
      if (event) event.stopPropagation(); //Stop send to Event
      setFormData((prevData) => ({
        ...prevData,
        isOpenPopup: true,
      }));
    };
    const closePopup = (event) => {
      if (event) event.stopPropagation(); //Stop send to Event
      setFormData((prevData) => ({
        ...prevData,
        isOpenPopup: false, //Close table row popup only
      }));
      if (onCloseRowTablePopup) {
        onCloseRowTablePopup(); //Callback if popup is open
      }
    };
    //Function openPopup and closePopup from ref
    useImperativeHandle(ref, () => ({
      openPopup,
      closePopup,
    }));
    //set type date
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    };
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    // console.log("Received Project:", project);
    if (!project) return null;
    const toggleDetail = () => {
      setFormData((prevData) => ({
        ...prevData,
        isDetailOpen: !prevData.isDetailOpen, //change open or close status
      }));
    };

    return (
      <>
        {formData.isOpenPopup && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="overflow-y-scroll max-w-screen-lg m-2 bg-white h-3/4 lg:h-5/6 p-5 rounded-lg shadow-md w-full">
              <div className="flex justify-between">
                <h3 className="text-sm badge bg-[#FFB200]/60 text-black border-none">
                  {project.workbom_no}
                </h3>
                <button
                  onClick={(event) => closePopup(event)}
                  className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white"
                >
                  ✕
                </button>
              </div>
              <h3 className="font-extrabold text-xl text-orange-600">
                <span>{project.project_name}</span>
              </h3>
              <div className="flex flex-row">
                <h3 className="font-bold text-sm">
                  Project Detail:{" "}
                  <span className="font-normal text-gray-400 font-NotoSansThai">
                    {project.project_detail}
                  </span>
                </h3>
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
              {/** Timeline status collapse for mobile **/}
              <details
                className="collapse collapse-arrow bg-[#FAF6E3] lg:hidden block overflow-hidden transition-all duration-300"
                onToggle={toggleDetail} //Use toggle detail for change status
              >
                <summary className="collapse-title text-base font-bold flex flex-row items-center gap-2">
                  <span>Click open timeline status</span>
                </summary>
                <div className="collapse-content max-h-0 group-open:max-h-[100px] overflow-hidden transition-all duration-300">
                  <ul className="timeline timeline-vertical lg:timeline-horizontal flex flex-col gap-[-100px]">
                     {/** Concept Deadline **/}
                     <li>
                      <div className="timeline-start flex flex-row gap-1">
                        <span className="font-normal">Deadline:</span>
                        <span className="font-bold text-[#FA7070]">
                          {project.electrical_deadline
                            ? project.electrical_deadline
                            : "-"}
                        </span>
                      </div>
                      {/** Status Icon **/}
                      <div className="timeline-middle">
                        {project.electrical_status == 3 ? (
                          /** Concept status = 3 --> Concept status is success **/
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
                        ) : project.electrical_status == 2 &&
                          parseDate(project.electrical_deadline) >=
                            currentDate ? (
                          /** Concept status = 2 && Concept deadline >= currentDate --> Have concept status and concept deadline not late **/
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
                        ) : project.electrical_status == 2 &&
                          parseDate(project.electrical_deadline) <
                            currentDate ? (
                          /** Concept status = 2 && Concept deadline < currentDate --> Have concept status and concept deadline late **/
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
                          /** Concept status = 1 --> No concept status **/
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
                          <div className="flex justify-center items-center text-[#FF4545]">
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
                          </div>
                        )}
                      </div>
                      {/** Concept Status **/}
                      <div
                        className={`w-full timeline-end timeline-box text-white text-center border-2 border-white font-bold ${
                          project.electrical_status == 3
                            ? "!bg-[#06D001]" //green --> success
                            : project.electrical_status == 2 &&
                              parseDate(project.electrical_deadline) >=
                                currentDate
                            ? "!bg-[#FFB200]" //yellow --> not late
                            : project.electrical_status == 2 &&
                              parseDate(project.electrical_deadline) <
                                currentDate
                            ? "!bg-[#FF4545]" //red --> late
                            : project.electrical_status == 1
                            ? "!bg-[#5AB2FF]" //blue --> no status
                            : "!bg-black" //error
                        }`}
                      >
                        {project.electrical_status != 3 &&
                        project.electrical_status != 2 &&
                        project.electrical_status != 1 ? (
                          <span>error</span>
                        ) : (
                          "Concept"
                        )}
                      </div>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                    </li>
                    {/** Backup Deadline **/}
                    <li>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                      <div className="timeline-start flex flex-row gap-1">
                        <span>Deadline:</span>
                        <span className="font-bold text-[#FA7070] ">
                          {project.mechanic_deadline !== "01/01/1970"
                            ? project.mechanic_deadline
                            : "-"}
                        </span>
                      </div>
                      {/** Status Icon **/}
                      <div className="timeline-middle">
                        {project.mechanic_status == 3 &&
                        project.mechanic_percent == 100 ? (
                          /** Backup status = 3 --> Backup status is success **/
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
                        ) : project.mechanic_status == 2 &&
                          parseDate(project.mechanic_deadline) >=
                            currentDate ? (
                          /** Backup status = 2 && Backup deadline >= currentDate --> Have backup status and backup deadline not late **/
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
                          parseDate(project.mechanic_deadline) < currentDate ? (
                          /** Backup status = 2 && Backup deadline < currentDate --> Have backup status and backup deadline late **/
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
                          /** Backup status = 1 --> No backup status **/
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
                          <div className="flex justify-center items-center text-[#FF4545]">
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
                          </div>
                        )}
                      </div>
                      {/** Backup Status **/}
                      <div
                        className={`w-full timeline-end timeline-box text-white text-center border-2 border-white font-bold ${
                          project.mechanic_status == 3
                            ? "!bg-[#06D001]" //green --> success
                            : project.mechanic_status == 2 &&
                              parseDate(project.mechanic_deadline) >=
                                currentDate
                            ? "!bg-[#FFB200]" //yellow --> not late
                            : project.mechanic_status == 2 &&
                              parseDate(project.mechanic_deadline) < currentDate
                            ? "!bg-[#FF4545]" //red --> late
                            : project.mechanic_status == 1
                            ? "!bg-[#5AB2FF]" //blue --> no status
                            : "!bg-black" //error
                        }`}
                      >
                        {project.mechanic_status != 3 &&
                        project.mechanic_status != 2 &&
                        project.mechanic_status != 1 ? (
                          <span>error</span>
                        ) : (
                          "Backup"
                        )}
                      </div>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                    </li>
                    {/** Program Deadline **/}
                    <li>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                      <div className="timeline-start flex flex-row gap-1">
                        <span>Deadline:</span>
                        <span className="font-bold text-[#FA7070]">
                          {project.program_deadline
                            ? project.program_deadline
                            : "-"}
                        </span>
                      </div>
                      {/** Status Icon **/}
                      <div className="timeline-middle">
                        {project.program_status == 3 &&
                        project.program_percent == 100 ? (
                          /** Program status = 3 --> Program status is success **/
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
                          parseDate(project.program_deadline) >= currentDate ? (
                          /** Program status = 2 && Program deadline >= currentDate --> Have program status and program deadline not late **/
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
                            {/***************/}
                          </div>
                        ) : project.program_status == 2 &&
                          parseDate(project.program_deadline) < currentDate ? (
                          /** Program status = 2 && Program deadline < currentDate --> Have program status and program deadline late **/
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
                          /** Program status = 1 --> No program status **/
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
                          <div className="flex justify-center items-center text-[#FF4545]">
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
                          </div>
                        )}
                      </div>
                      {/** Program Status **/}
                      <div
                        className={`w-full timeline-end timeline-box text-white text-center border-2 border-white font-bold ${
                          project.program_status == 3
                            ? "!bg-[#06D001]" //green --> success
                            : project.program_status == 2 &&
                              parseDate(project.program_deadline) >= currentDate
                            ? "!bg-[#FFB200]" //yellow --> not late
                            : project.program_status == 2 &&
                              parseDate(project.program_deadline) < currentDate
                            ? "!bg-[#FF4545]" //red --> late
                            : project.program_status == 1
                            ? "!bg-[#5AB2FF]" //blue --> no status
                            : "!bg-black" //error
                        }`}
                      >
                        {project.program_status != 3 &&
                        project.program_status != 2 &&
                        project.program_status != 1 ? (
                          <span>error</span>
                        ) : (
                          "Program"
                        )}
                      </div>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                    </li>
                    {/** Manual Deadline **/}
                    <li>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                      <div className="timeline-start flex flex-row gap-1">
                        <span>Deadline:</span>
                        <span className="font-bold text-[#FA7070]">
                          {project.safetycheck_deadline
                            ? project.safetycheck_deadline
                            : "-"}
                        </span>
                      </div>
                      {/** Status Icon **/}
                      <div className="timeline-middle">
                        {project.safetycheck_status == 3 ? (
                          /** Manual status = 3 --> Manual status is success **/
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
                          /** Manual status = 2 && Manual deadline >= currentDate --> Have manual status and manual deadline not late **/
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
                          /** Manual status = 2 && Manual deadline < currentDate --> Have manual status and manual deadline late **/
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
                        ) : project.safetycheck_status == 1 ? (
                          /** Manual status = 1 --> No manual status **/
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
                          <div className="flex justify-center items-center text-[#FF4545]">
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
                          </div>
                        )}
                      </div>
                      {/** Manual Status **/}
                      <div
                        className={`w-full timeline-end timeline-box text-white text-center border-2 border-white font-bold ${
                          project.safetycheck_status == 3
                            ? "!bg-[#06D001]" //green --> success
                            : project.safetycheck_status == 2 &&
                              parseDate(project.safetycheck_deadline) >=
                                currentDate
                            ? "!bg-[#FFB200]" //yellow --> not late
                            : project.safetycheck_status == 2 &&
                              parseDate(project.safetycheck_deadline) <
                                currentDate
                            ? "!bg-[#FF4545]" //red --> late
                            : project.safetycheck_status == 1
                            ? "!bg-[#5AB2FF]" //blue --> no status
                            : "!bg-black" //error
                        }`}
                      >
                        {project.safetycheck_status != 3 &&
                        project.safetycheck_status != 2 &&
                        project.safetycheck_status != 1 ? (
                          <span>error</span>
                        ) : (
                          "Manual"
                        )}
                      </div>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                    </li>
                    {/** Save file Deadline **/}
                    <li>
                      <hr className="h-1 bg-[#D6E6F2] border-0" />
                      <div className="timeline-start flex flex-row gap-1">
                        <span>Deadline:</span>
                        <span className="font-bold text-[#FA7070]">
                          {project.testrun_deadline
                            ? project.testrun_deadline
                            : "-"}
                        </span>
                      </div>
                      {/** Status Icon **/}
                      <div className="timeline-middle">
                        {project.testrun_status == 3 ? (
                          /** Save file status = 3 --> Save file status is success **/
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
                          parseDate(project.testrun_deadline) >= currentDate ? (
                          /** Save file status = 2 && Save file deadline >= currentDate --> Have save file status and save file deadline not late **/
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
                        ) : project.testrun_status == 2 &&
                          parseDate(project.testrun_status) < currentDate ? (
                          /** Save file status = 2 && Save file deadline < currentDate --> Have save file status and save file deadline late **/
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
                          /** Save file status = 1 --> No Save file status **/
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
                          <div className="flex justify-center items-center text-[#FF4545]">
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
                          </div>
                        )}
                      </div>
                      {/** Save file Status **/}
                      <div
                        className={`w-full timeline-end timeline-box text-white text-center border-2 border-white font-bold ${
                          project.testrun_status == 3
                            ? "!bg-[#3CCF4E]" //green --> success
                            : project.testrun_status == 2 &&
                              parseDate(project.testrun_deadline) >= currentDate
                            ? "!bg-[#FFB200]" //yellow --> not late
                            : project.testrun_status == 2 &&
                              parseDate(project.testrun_deadline) < currentDate
                            ? "!bg-[#FF4545]" //red --> late
                            : project.testrun_status == 1
                            ? "!bg-[#5AB2FF]" //blue --> no status
                            : "!bg-black" //error
                        }`}
                      >
                        {project.testrun_status != 3 &&
                        project.testrun_status != 2 &&
                        project.testrun_status != 1 ? (
                          <span>error</span>
                        ) : (
                          "Save file"
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </details>
              {/** Desktop Timeline Status **/}
              <div className="lg:flex lg:flex-row justify-evenly items-center whitespace-nowrap drop-shadow-md hidden lg:block">
                {/** Concept Status **/}
                <div
                  className={`min-w-[190px] text-white relative w-auto h-auto py-3 px-2 bg-gray-300 text-center leading-8 ${
                    project.program_status == 3
                      ? "!bg-[#06D001]" //green --> success
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) >= currentDate
                      ? "!bg-[#FFB200]" //yellow --> not late
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) < currentDate
                      ? "!bg-[#FF4545]" //red --> late
                      : project.program_status == 1
                      ? "!bg-[#5AB2FF]" //blue --> no status
                      : "!bg-black " //error
                  }`}
                  style={{
                    clipPath:
                      "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
                  }}
                >
                  <div className="font-bold">
                    {project.program_status != 3 &&
                    project.program_status != 2 &&
                    project.program_status != 1 ? (
                      <span>error</span>
                    ) : (
                      "Concept"
                    )}
                  </div>
                  <div>
                    Deadline:{" "}
                    {project.program_deadline !== "01/01/1970"
                      ? project.program_deadline
                      : "-"}
                  </div>
                </div>
                {/** Backup Status **/}
                <div
                  className={`min-w-[190px] text-white relative w-auto h-auto py-3 px-2 bg-gray-300 text-center leading-8 ${
                    project.program_status == 3
                      ? "!bg-[#06D001]" //green --> success
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) >= currentDate
                      ? "!bg-[#FFB200]" //yellow --> not late
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) < currentDate
                      ? "!bg-[#FF4545]" //red --> late
                      : project.program_status == 1
                      ? "!bg-[#5AB2FF]" //blue --> no status
                      : "!bg-black " //error
                  }`}
                  style={{
                    clipPath:
                      "polygon(90% 0%, 0% 0%, 10% 50%, 0% 100%, 90% 100%, 100% 50%)",
                  }}
                >
                  <div className="font-bold">
                    {project.program_status != 3 &&
                    project.program_status != 2 &&
                    project.program_status != 1 ? (
                      <span>error</span>
                    ) : (
                      "Backup"
                    )}
                  </div>
                  <div>
                    Deadline:{" "}
                    {project.program_deadline
                      ? project.program_deadline
                      : "-"}
                  </div>
                </div>
                {/** Program Status **/}
                <div
                  className={`min-w-[190px] text-white relative w-auto h-auto py-3 px-2 bg-gray-300 text-center leading-8 ${
                    project.program_status == 3
                      ? "!bg-[#06D001]" //green --> success
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) >= currentDate
                      ? "!bg-[#FFB200]" //yellow --> not late
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) < currentDate
                      ? "!bg-[#FF4545]" //red --> late
                      : project.program_status == 1
                      ? "!bg-[#5AB2FF]" //blue
                      : "!bg-black" //error
                  }`}
                  style={{
                    clipPath:
                      "polygon(90% 0%, 0% 0%, 10% 50%, 0% 100%, 90% 100%, 100% 50%)",
                  }}
                >
                  <div className="font-bold">
                    {project.program_status != 3 &&
                    project.program_status != 2 &&
                    project.program_status != 1 ? (
                      <span>error</span>
                    ) : (
                      "Program"
                    )}
                  </div>
                  <div>
                    Deadline:{" "}
                    {project.program_deadline ? project.program_deadline : "-"}
                  </div>
                </div>
                {/** Manual Status **/}
                <div
                  className={`min-w-[190px] text-white relative w-auto h-auto py-3 px-2 bg-gray-300 text-center leading-8 ${
                    project.program_status == 3
                      ? "!bg-[#06D001]" //green --> success
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) >= currentDate
                      ? "!bg-[#FFB200]" //yellow --> not late
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) < currentDate
                      ? "!bg-[#FF4545]" //red --> late
                      : project.program_status == 1
                      ? "!bg-[#5AB2FF]" //blue
                      : "!bg-black" //error
                  }`}
                  style={{
                    clipPath:
                      "polygon(90% 0%, 0% 0%, 10% 50%, 0% 100%, 90% 100%, 100% 50%)",
                  }}
                >
                  <div className="font-bold">
                    {project.program_status != 3 &&
                    project.program_status != 2 &&
                    project.program_status != 1 ? (
                      <span>error</span>
                    ) : (
                      "Manual"
                    )}
                  </div>
                  <div>
                    Deadline:{" "}
                    {project.program_deadline
                      ? project.program_deadline
                      : "-"}
                  </div>
                </div>
                {/** Save file Status **/}
                <div
                  className={`min-w-[190px] text-white relative w-auto h-auto py-3 px-2 bg-gray-300 text-center leading-8 ${
                    project.program_status == 3
                      ? "!bg-[#3CCF4E]" //green --> success
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) >= currentDate
                      ? "!bg-[#FFB200]" //yellow --> not late
                      : project.program_status == 2 &&
                        parseDate(project.program_deadline) < currentDate
                      ? "!bg-[#FF4545]" //red --> late
                      : project.program_status == 1
                      ? "!bg-[#5AB2FF]" //blue
                      : "!bg-black" //error
                  }`}
                  style={{
                    clipPath:
                      "polygon(100% 0%, 0% 0%, 10% 50%, 0% 100%, 100% 100%, 100% 100%)",
                  }}
                >
                  <div className="font-bold">
                    {project.program_status != 3 &&
                    project.program_status != 2 &&
                    project.program_status != 1 ? (
                      <span>error</span>
                    ) : (
                      "Save file"
                    )}
                  </div>
                  <div>
                    Deadline:{" "}
                    {project.program_deadline ? project.program_deadline : "-"}
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              {/** Timeline **/}
              <div
                className={`flex flex-col p-12 gap-y-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 lg:h-3/5 h-2/3 overflow-y-scroll delay-100`}
              >
                {Array.isArray(project?.project_details_logs) &&
                  project.project_details_logs
                    .slice()
                    .map((projectDetail, index) => (
                      <div
                        className="flex flex-row items-start gap-x-4 md:gap-x-6 lg:gap-x-8 mb-4"
                        key={index}
                      >
                        <div className="flex-shrink-0 basis-24 md:basis-28 lg:basis-32 text-right text-sm lg:text-md font-sans text-slate-900 dark:text-slate-50">
                          {projectDetail.log_time}
                        </div>
                        {/** Circle and line part **/}
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full text-white items-center justify-center font-bold sm:p-4 sm:text-base ${
                              projectDetail.status == "Success"
                                ? "bg-[#8FD14F]" //green --> success status
                                : projectDetail.status == "Edited"
                                ? "bg-[#8B5DFF]" //violet --> edit status
                                : projectDetail.status == "Update"
                                ? "bg-[#F37199]" //pink --> update status
                                : projectDetail.status == "In Progress"
                                ? "bg-[#FFBB64]" //yellow --> in process status
                                : "bg-[#279EFF]" //blue --> create
                            }`}
                          >
                            {project.project_details_logs.length - 1 - index}
                          </div>
                          {index !== project.length - 1 && (
                            <div className="absolute top-full mt-1 w-px h-full bg-gray-300"></div>
                          )}
                        </div>
                        {/** Content part **/}
                        <div className="flex-grow flex min-w-48 md:min-w-52 lg:min-w-60 flex-col text-sm gap-y-2">
                          <div
                            className={`font-bold ${
                              projectDetail.status == "Success"
                                ? "text-[#06D001]" //green --> success status
                                : projectDetail.status == "Edited"
                                ? "text-[#6A42C2]" //violet --> edit status
                                : projectDetail.status == "Update"
                                ? "text-[#F37199]" //pink --> update status
                                : projectDetail.status == "In Progress"
                                ? "text-[#FFC100]" //yellow --> in process status
                                : "text-[#0D92F4]" //blue --> create
                            }`}
                          >
                            {projectDetail.status}
                          </div>
                          <div className="font-semibold text-[#151515] font-NotoSansThai">
                            {projectDetail.project_header}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {projectDetail.comment_detail && (
                              <p style={{ whiteSpace: "pre-line" }}>
                                {projectDetail.comment_detail}
                              </p>
                            )}
                            <p>
                              {projectDetail.status == "Created"
                                ? `Created by: ${projectDetail.log_user}`
                                : projectDetail.status == "Edited"
                                ? `Edited by: ${projectDetail.log_user}`
                                : `Updated by: ${projectDetail.log_user}`}
                            </p>
                          </div>
                          <div className="text-slate-600 text-sm">
                            {projectDetail.log_file ? (
                              <a
                                href={projectDetail.log_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-row gap-2 underline hover:underline-offset-4 text-[#FF885B]"
                              >
                                {/** Icon File **/}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-file-earmark-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
                                </svg>
                                {/****************/}{" "}
                                {projectDetail.log_file.split("/").pop()}
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handlePopup("UpdateProject", "open", project.workbom_id);
                }}
                className="mt-2 font-semibold text-xs shadow w-auto p-3 h-[40px] bg-[#00CCDD] rounded-lg hover:bg-[#6FDCE3] focus:ring-2 focus:outline-none focus:ring-[#7EA1FF] text-white flex flex-row justify-center items-center gap-1"
              >
                {/** Icon Download Button **/}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-file-earmark-arrow-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0" />
                </svg>
                {/*************************/}
                File
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);
export default ProgrammerRowTablePopup;

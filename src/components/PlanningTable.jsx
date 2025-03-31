import axios from "axios";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PlanningTable(props) {
  const navigate = useNavigate();
  const formatDate = (dateStr) => {
    if (!dateStr) return "-"; //if no data send -
    const date = new Date(dateStr); //change type date object
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const handleDeleteProject = async (event, projectId, workbomNo) => {
    event.stopPropagation();
    //console.log(projectId, "project id");
    const result = await Swal.fire({
      title: "Delete Project",
      text: `ยืนยันการลบโปรเจค ${workbomNo}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E50046",
      cancelButtonColor: "#D8D9DA",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        const url = `http://192.168.1.150/deleteworkbom`;
        let projectData = {
          ...formData,
          id: projectId,
        };
        const response = await axios.post(url, projectData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "8b5390a92b222d5678abab770e2b99b7",
          },
        });

        if (response.status === 200) {
          setFormData((prevData) => ({
            ...prevData,
            showProjectList: prevData.showProjectList.filter(
              (project) => project.id !== projectId
            ),
          }));

          Swal.fire(
            "Delete Project",
            `ลบโปรเจค ${workbomNo} สำเร็จ!`,
            "success"
          );
        } else {
          throw new Error("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        Swal.fire("Error", `ลบโปรเจค ${workbomNo} ไม่สำเร็จ !`, "error");
      }
    }
  };

  const goToAddNewProject = () => {
    navigate("/addNewProject");
  };
  const goToEditProject = (projectId) => {
    //console.log("Navigating to EditProjectPage with ID:", projectId);
    //send projectId to editProject page
    navigate(`/editProject/${projectId}`);
  };
  const [formData, setFormData] = useState({
    showProjectList: [],
    searchText: "",
    username: "",
    session: null,
  });

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

  const checkPermission = (allowedPermissions) => {
    return allowedPermissions.includes(formData.session.permission);
  };

  const getProjectList = async () => {
    //check path
    const url = "http://192.168.1.150/listworkbom";
    //console.log(formData.username, "Check");
    try {
      const result = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "c7c6a83c92c0531996eabe15037bbeda",
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

  useEffect(() => {
    if (formData.username) {
      getProjectList();
    }
  }, [formData.username]);

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

  return (
    <div className="mt-[-5px] col-span-full xl:col-span-6 bg-white shadow-sm rounded-xl font-Quicksand">
      <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 text-xl font-LexendDeca">
          Project List
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
          <button
            onClick={goToAddNewProject}
            className="shadow flex flex-row gap-3 btn bg-gradient-to-r from-[#FF4D00] to-[#FFC002] hover:from-pink-500 hover:via-orange-500 hover:to-orange-600 active:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-300 justify-center w-full h-auto py-3 px-10 text-sm font-semibold tracking-wider text-white bg-[#f16a2b] hover:bg-[#f16a2b]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg>
            <span className="max-xs:sr-only">New Project</span>
          </button>
        </div>
      </header>
      <div className="p-3 overflow-x-auto font-medium h-[calc(100vh-200px)]">
        <div className="relative h-full overflow-y-auto">
          <table className="table-auto w-full">
            <thead className="sticky top-0 z-10 font-bold uppercase text-xs text-center text-white bg-[#A0937D]">
              <tr>
                <th className="p-2 whitespace-nowrap">No.</th>
                <th className="p-2 whitespace-nowrap">Workbom No.</th>
                <th className="p-2 whitespace-nowrap">Project Name</th>
                <th className="p-2 whitespace-nowrap">Customer</th>
                <th className="p-2 whitespace-nowrap">Sales</th>
                <th className="p-2 whitespace-nowrap">Design</th>
                <th className="p-2 whitespace-nowrap">Automation</th>
                <th className="p-2 whitespace-nowrap">Programmer</th>
                <th className="p-2 whitespace-nowrap">Timeline</th>
                <th className="p-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm divide-y divide-gray-100">
              {filteredProject && filteredProject.length > 0 ? (
                filteredProject.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <tr
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handlePopup("RowTable", "open", project.id);
                      }}
                      className={`text-center cursor-pointer ${
                        index % 2 == 0
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
                          className="lg:tooltip lg:tooltip-warning z-10 lg:z-44 relative"
                          data-tip={project.name}
                        >
                          {project.name
                            ? project.name.slice(0, 20) +
                              (project.name.length > 20 ? "..." : "")
                            : ""}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">{project.owner}</td>
                      <td className="p-2 whitespace-nowrap">
                        {project.sale_person_user
                          ? project.sale_person_user
                          : "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.design_person_user
                          ? project.design_person_user
                          : "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.auto_person_user
                          ? project.auto_person_user
                          : "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {project.program_person_user
                          ? project.program_person_user
                          : "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {formatDate(project.project_start)}-
                        {formatDate(project.project_end)}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex flex-row justify-center gap-3">
                          {/** Edit button **/}
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              //console.log("Editing Project:", project.id);
                              goToEditProject(project.id);
                            }}
                            className="shadow w-auto px-3 h-[35px] bg-[#E8B86D]/90 rounded-full hover:bg-[#E0A75E] focus:ring-2 focus:outline-none focus:ring-[#A67B5B] text-white flex flex-row justify-center items-center gap-1"
                          >
                            {/** Edit Icon **/}
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
                            {/***************/}
                            Edit
                          </button>
                          {/** Delete button **/}
                          {checkPermission(["Admin"]) && (
                            <button
                              onClick={(event) =>
                                handleDeleteProject(
                                  event,
                                  project.id,
                                  project.workbom_no
                                )
                              }
                              className="shadow w-auto pl-3 pr-3 h-[35px] bg-[#FF0000]/80 hover:bg-[#E72929] 
             focus:ring-2 focus:outline-none focus:ring-[#FF8C9E] 
             dark:focus:ring-[#FF4E88] text-white font-medium 
             rounded-full flex justify-center items-center"
                            >
                              {/** Delete Icon **/}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash3-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5.5 0 0 1 11 1.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                              </svg>
                              {/****************/}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
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

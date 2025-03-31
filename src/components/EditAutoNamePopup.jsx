import axios from "axios";
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Swal from "sweetalert2";

const EditAutoNamePopup = forwardRef(({ project }, ref) => {
  // console.log("project", project)
  const [formData, setFormData] = useState({
    workbomId: 0,
    workbomNo: 0,
    /** Automation **/
    selectedAutomation: [],
    searchAutomation: "",
    automationList: [],
    highlightedIndexAutomation: -1,
    isTypingAutomation: false,
    showInputAutomation: false,
    /***************/
    isOpenPopup: false,
    isRowPopupOpen: false,
    isDetailOpen: false,
    username: "",
  });

  const dialogRef = useRef(null);
  const automationRef = useRef(null);
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

  useEffect(() => {
    //console.log("Received project in UpdateProjectPopup:", project);
    if (project) {
      setFormData((prevData) => ({
        ...prevData,
        workbomId: project?.workbom_id,
        workbomNo: project?.workbom_no,
        selectedAutomation: project?.project_person_responsible, // ✅ ข้อมูลเป็น Array
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

  // Add another useEffect to log when formData updates
  // useEffect(() => {
  //   console.log("Updated formData.workbomId:", formData.workbomId);
  // }, [formData.workbomId]); // Log whenever workbomId changes

  const getAutomationList = async () => {
    const url = `http://192.168.1.150/viewlistuser?department=Automation`;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "86fcdcba83e6b8bf98c2ac5dbf472fda",
      },
    });
    setFormData((prevFormData) => ({
      ...prevFormData, // คัดลอกค่าทั้งหมดจาก formData เดิม
      automationList: result.data.data, // อัปเดตแค่ userList
    }));
    //console.log("✅ API Response:", result.data);
  };

  const handleSelectChangeAutomation = (option, e) => {
    e.preventDefault();
    // ตรวจสอบว่า user ที่เลือกมีอยู่ใน selectedUser แล้วหรือยัง
    if (
      !formData.selectedAutomation.some(
        (selected) =>
          selected.username == option.username ||
          selected.lastname == option.lastname
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        selectedAutomation: [...prevData.selectedAutomation, option.username], // เพิ่มตัวเลือกใหม่ในรายการที่เลือก
        searchAutomation: "", // ล้างข้อความค้นหาหลังจากเลือก
        highlightedIndexAutomation: -1, // รีเซ็ตตำแหน่งตัวเลือกที่ถูกเลือก
        isTypingAutomation: false, // ให้ยังคงอยู่ในโหมดพิมพ์หลังจากเลือกคน
        showInputAutomation: false, // ซ่อน input หลังจากเลือกคนแล้ว
      }));
    }
  };

  const handleSearchChangeAutomation = (e) => {
    // อัปเดตค่าใน formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      searchAutomation: e.target.value, // อัปเดตค่า search
      isTypingAutomation: true, // ระบุว่ากำลังพิมพ์
      highlightedIndexAutomation: -1, // รีเซ็ตตำแหน่งที่เลือก
    }));
  };

  // ฟังก์ชันกด Enter หรือปุ่มลูกศร
  const handleKeyDownAutomation = (e) => {
    if (e.key == "ArrowDown") {
      // เลื่อนลงใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexAutomation: Math.min(
          prevFormData.highlightedIndexAutomation + 1,
          filteredOptionsAutomation.length - 1
        ),
      }));
    } else if (e.key == "ArrowUp") {
      // เลื่อนขึ้นใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexAutomation: Math.max(
          prevFormData.highlightedIndexAutomation - 1,
          0
        ),
      }));
    } else if (e.key == "Enter") {
      e.preventDefault();
      if (
        formData.highlightedIndexAutomation >= 0 &&
        formData.highlightedIndexAutomation < filteredOptionsAutomation.length
      ) {
        handleSelectChangeAutomation(
          filteredOptionsAutomation[formData.highlightedIndexAutomation],
          e
        ); // เลือกตัวเลือกที่กำลังถูกเลือก
      } else if (formData.searchAutomation.trim()) {
        // ถ้าไม่มีการเลือกใน dropdown และพิมพ์ชื่อที่ไม่อยู่ใน data จะไม่เพิ่มอะไร
        const search = formData.searchAutomation.trim().toLowerCase(); // คำค้นหา
        const existingOption = formData.automationList.find((option) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${option.username || ""} ${
            option.lastname || ""
          }`.toLowerCase();
          return fullName.includes(search); // เปรียบเทียบกับคำค้นหา
        });
        if (existingOption) {
          handleSelectChangeAutomation(existingOption, e); // ถ้ามีชื่ออยู่ในรายการแล้ว
        }
      }
    }
  };
  //Function delete choice
  const handleRemoveOptionAutomation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedAutomation: prevData.selectedAutomation.filter(
        (item, i) => i !== index
      ),
    }));
  };
  //Function show input when click
  const handleInputClickAutomation = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showInputAutomation: true, //show input when click
      isTypingAutomation: true,
    }));
  };
  //Function filter choice from search word (ตรวจสอบว่าชื่อมีค่าก่อนเรียก toLowerCase)
  const filteredOptionsAutomation =
    formData.automationList.length > 0
      ? formData.automationList.filter((user) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${user.username} ${user.lastname}`.toLowerCase();
          // เปรียบเทียบ fullName กับคำค้นหา
          const search = formData.searchAutomation
            ? formData.searchAutomation.toLowerCase()
            : "";
          // เปรียบเทียบกับคำค้นหา
          return fullName.includes(search);
        })
      : [];

  useEffect(() => {
    getAutomationList();
  }, []);

  const editAutoName = async () => {
    try {
      const url = "http://192.168.1.150/updateuserauto";
      // ตรวจสอบว่า selectedAutomation เป็น array หรือไม่
      const formattedStringAuto = Array.isArray(formData.selectedAutomation)
        ? formData.selectedAutomation.join(",")
        : [];
      //console.log("formattedStringAuto", formattedStringAuto)
      let projectData = {
        ...formData,
        workbomid: formData.workbomId,
        person_user_auto: formattedStringAuto,
        updateby: formData.username,
      };
      // console.log("📦 Sending Data to API:", projectData);
      // console.log("Workbom Id: ", projectData.workbomid);
      // console.log("person_responsible: ", projectData.person_user_auto);
      // console.log("updateby", projectData.updateby)
      // ลบฟิลด์ที่มีค่าเป็น null หรือ undefined
      // projectData = Object.fromEntries(
      //   Object.entries(projectData).filter(([_, v]) => v != null)
      // );
      const result = await axios.post(url, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "e0704b898a9ae43f9ff5807e8e8f5c7e",
        },
      });
      //console.log("result", result)
      if (result.status === 200) {
        Swal.fire({
          title: "Edit Name",
          text: "แก้ไขชื่อสำเร็จ!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.setItem("lastPage", window.location.pathname); // จำหน้าปัจจุบัน
            window.location.reload(); // รีโหลดหน้า
          }
        });
      } else {
        Swal.fire({
          title: "แก้ไขชื่อไม่สำเร็จ!",
          text: result.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to edit project. Please try again.");
    }
  };

  const handleEditAutoName = (event) => {
    event.preventDefault();
    //closePopup();
    // Helper function to focus and scroll to input
    const focusAndScrollTo = (ref, errorMessage) => {
      if (ref.current) {
        ref.current.focus();
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          focusConfirm: false,
          allowOutsideClick: false,
        }).then(() => {
          openPopup(); // เปิด Popup Edit Name กลับมาเมื่อกด "OK"
        });
      }
    };
    closePopup();
    // Validation checks
    if (!formData.selectedAutomation.length) {
      focusAndScrollTo(automationRef, "กรุณาเลือกชื่อ Automation!");
      return; // หยุดการทำงานหากไม่ได้เลือก Automation
    }
    closePopup();
    Swal.fire({
      title: "Edit Name",
      text: "ยืนยันการแก้ไขชื่อ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1AACAC",
      cancelButtonColor: "#E2DAD6",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        editAutoName();
      } else {
        // ถ้ากด Cancel ให้เปิด Popup Edit Name กลับมา
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
                {/** Icon Edit Name Button **/}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-people-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
                {/*************************/}
                Edit Name Automation
              </h3>
            </header>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleEditAutoName}>
            <div>
              <label
                htmlFor="automation"
                className="font-bold text-[#45474B] flex flex-row justify-start"
              >
                <span className="text-red-600 font-bold">*</span>
                Automation
              </label>
              <div className="w-full h-full mx-auto">
                {/** Container for Selected Options and Input **/}
                <div
                  className="relative flex items-center p-2 gap-2 flex-wrap border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                  style={{ minHeight: "50px" }}
                  onClick={handleInputClickAutomation}
                >
                  {/** Display "Select Staff" if no input or selectedUser **/}
                  {formData.selectedAutomation.length == 0 &&
                    !formData.searchAutomation && (
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        Select Staff
                      </div>
                    )}
                  {/** Display Selected Chips inside the input **/}
                  {formData.selectedAutomation.map((option, index) => {
                    //console.log("Option2:", option);
                    return (
                      <div
                        key={index}
                        className="flex items-center bg-[#F0EBCC] rounded-full py-1 pl-2 pr-1 text-black w-auto h-auto"
                      >
                        <span>{option}</span>
                        <button
                          className="ml-2 text-gray-500"
                          onClick={() => handleRemoveOptionAutomation(index)}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                  {/** Input for searching and selecting options **/}
                  <input
                    ref={automationRef}
                    type="text"
                    autoComplete="off"
                    className="bg-white text-black border-b-2 border-t-0 border-l-0 border-r-0 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex-grow"
                    onChange={handleSearchChangeAutomation}
                    onKeyDown={handleKeyDownAutomation}
                    value={formData.searchAutomation}
                    autoFocus
                    style={{
                      minWidth: "120px",
                      border: "none",
                      outline: "none",
                    }}
                    id="automation"
                  />
                </div>
                {/** Dropdown for options **/}
                {formData.searchAutomation && (
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-white rounded-box w-full mt-2"
                  >
                    {filteredOptionsAutomation.length > 0 ? (
                      filteredOptionsAutomation.map((option, index) => {
                        //console.log("Option:", option); // ✅ log ข้อมูลก่อน return
                        return (
                          <li
                            key={index}
                            onClick={(e) =>
                              handleSelectChangeAutomation(option, e)
                            }
                            className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center ${
                              formData.highlightedIndexAutomation === index
                                ? "bg-gray-200"
                                : ""
                            }`}
                          >
                            {option.username} {option.lastname}
                          </li>
                        );
                      })
                    ) : (
                      <li className="p-2">No results found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="w-auto h-auto px-12 py-2 rounded-lg mt-5 shadow font-extrabold text-sm text-white bg-[#FFA24C] hover:bg-[#FFAF00] focus:ring-4 focus:outline-none focus:ring-yellow-400 dark:focus:ring-orange-800"
                type="submit"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
});
export default EditAutoNamePopup;

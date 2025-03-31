import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddNewUser = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    selectedDepartment: "",
    selectedPosition: "",
    username: "",
    password: "",
    showPassword: false,
  });
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);
  const selectedDepartmentRef = useRef(null);
  const selectedPositionRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openPopup: () => {
      dialogRef.current?.showModal();
    },
    closePopup: () => {
      dialogRef.current?.close();
    },
  }));

  const createNewUserAccount = async () => {
    try {
      const url = `http://192.168.1.150/createuser`;
      const userData = {
        username: formData.username,
        password: formData.password,
        surname: formData.name,
        lastname: formData.nickname,
        position: formData.selectedPosition,
        department: formData.selectedDepartment,
      };
      const result = await axios.post(url, userData, {
        headers: {
          Authorization: "49cbcd9bc1b0ede646281502bd18176b",
        },
      });
      if (result.status === 200) {
        Swal.fire({
          title: "Add new user",
          text: "เพิ่มผู้ใช้ใหม่สำเร็จ !",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Error", "เกิดข้อผิดพลาด: ไม่สามารถเพิ่มผู้ใช้ได้", "error");
      }
    } catch (error) {
      Swal.fire("Error", "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้ โปรดลองใหม่อีกครั้ง");
    }
  };
  
  const handleCloseAddNewUserPopup = (event) => {
    event.preventDefault();
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setFormData((prevData) => ({
      ...prevData,
      name: "",
      nickname: "",
      selectedDepartment: "",
      selectedPosition: "",
      username: "",
      password: "",
    }));
  };

  const showError = (ref, errorMessage) => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error",
      focusConfirm: false, // ปิด focus ของ SweetAlert
      allowOutsideClick: false, // ไม่ให้คลิกข้างนอกปิด SweetAlert
    }).then(() => {
      // ใช้ setTimeout เพื่อให้ SweetAlert ปิดสนิทก่อน
      setTimeout(() => {
        if (!dialogRef.current?.open) {
          dialogRef.current.showModal(); // เปิด dialog ใหม่
          if (ref.current) {
            ref.current.focus(); // Focus ไปที่ input ที่เกี่ยวข้อง
            ref.current.scrollIntoView({ behavior: "smooth" }); // เลื่อน scroll ให้อยู่ในมุมมอง
          }
        }
      }, 300); // เพิ่ม delay เพื่อให้ SweetAlert ปิดสนิทก่อน
    });
  };

  const handleAddNewUserPopup = (event) => {
    event.preventDefault();
    // ตรวจสอบว่าในแต่ละช่อง input มีข้อมูลไหม
    if (!formData.name) {
      showError(nameRef, "กรุณากรอกชื่อ (Name)", "name");
      return;
    }
    if (!formData.nickname) {
      showError(nicknameRef, "กรุณากรอกชื่อเล่น (Nickname)", "nickname");
      return;
    }
    if (!formData.selectedDepartment.length) {
      showError(selectedDepartmentRef, "กรุณากรอกแผนก (Department)", "selectedDepartment");
      return;
    }
    if (!formData.selectedPosition.length) {
      showError(selectedPositionRef, "กรุณากรอกตำแหน่ง (Position)", "selectedPosition");
      return;
    }
    if (!formData.username) {
      showError(usernameRef, "กรุณากรอก Username", "username");
      return;
    }
    if (!formData.password) {
      showError(passwordRef, "กรุณากรอก Password", "password");
      return;
    }

    dialogRef.current.close(); // ใช้ ref เพื่อปิด popup

    Swal.fire({
      title: "Add New User",
      text: "ยืนยันการเพิ่มผู้ใช้ใหม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1AACAC",
      cancelButtonColor: "#E2DAD6",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        createNewUserAccount();
      }
    });
  };

  return (
    <>
      <dialog ref={dialogRef} className="modal overflow-visible">
        <div className="modal-box bg-white text-black lg:overflow-visible lg:w-3/5 w-auto px-10 max-h-[100vh] flex flex-col overflow-y-auto relative z-[100] rounded-md">
          {/* close button */}
          <button
            onClick={handleCloseAddNewUserPopup}
            className="btn btn-sm btn-circle shadow rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white absolute right-1 top-1"
          >
            ✕
          </button>
          <header className="w-full h-full border-b border-gray-200 mb-5">
            <h3 className="mb-5 font-extrabold font-LexendDeca text-xl text-[#758694] flex flex-row items-center gap-2">
              {/* icon add */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-circle-dotted"
                viewBox="0 0 16 16"
              >
                <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
              Add New User Account
            </h3>
          </header>
          <form onSubmit={handleAddNewUserPopup}>
            <div className="flex flex-col flex-grow gap-4">
              <div className="flex flex-row gap-2 lg:justify-around">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-bold text-gray-800">
                    <span className="font-bold text-red-600">*</span> Name
                  </label>
                  <input
                  ref={nameRef}
                    type="text"
                    placeholder="Type here.."
                    className="w-full h-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    value={formData.name}
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    id="name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="nickname" className="font-bold text-gray-800">
                    <span className="font-bold text-red-600">*</span> Nickname
                  </label>
                  <input
                  ref={nicknameRef}
                    type="text"
                    placeholder="Type here.."
                    className="w-full h-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    value={formData.nickname}
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    id="nickname"
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:justify-around">
                <div className="form-control">
                  <label
                    htmlFor="selectedDepartment"
                    className="font-bold text-gray-800"
                  >
                    <span className="text-red-600 font-bold">*</span> Department
                  </label>
                  <select
                   ref={selectedDepartmentRef}
                    className="selected w-full h-full text-left lg:px-9 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    value={formData.selectedDepartment}
                    onChange={(e) => setFormData({ ...formData, selectedDepartment: e.target.value })}
                    id="selectedDepartment"
                  >
                    <option value="" disabled>
                      {" "}
                      Choose here{" "}
                    </option>
                    <option value="Design">Design Engineer</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Sales Engineer">Sales Engineer</option>
                    <option value="Planning">Planning</option>
                    <option value="Program">Program</option>
                    <option value="Develop">Develop</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>

                <div className="form-control">
                  <label
                    htmlFor="selectedPosition"
                    className="font-bold text-gray-800 mt-3 lg:mt-0"
                  >
                    <span className="font-bold text-red-600">*</span> Position
                  </label>
                  <select
                  ref={selectedPositionRef}
                    className="selected w-full h-full text-left lg:px-7 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    value={formData.selectedPosition}
                     onChange={(e) => setFormData({ ...formData, selectedPosition: e.target.value })}
                    id="selectedPosition"
                  >
                    <option value="" disabled>
                      {" "}
                      Choose here{" "}
                    </option>
                    <option value="President">President</option>
                    <option value="Manager">Manager</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Team Assistant">Team Assistant</option>
                    <option value="Staff">Staff</option>
                    <option value="No Position">-</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-2 lg:justify-around">
                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="font-bold text-gray-800">
                    <span className="font-bold text-red-600">*</span> Username
                  </label>
                  <input
                  ref={usernameRef}
                    type="text"
                    placeholder="Type here.."
                    className="w-full h-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    value={formData.username}
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    id="username"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="font-bold text-gray-800">
                    <span className="font-bold text-red-600">*</span> Password
                  </label>
                  <div className="relative w-full">
                    <input
                    ref={passwordRef}
                      type={formData.showPassword ? "text" : "password"}
                      placeholder="Type here.."
                      className="w-full h-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                      value={formData.password}
                      autoComplete="off"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      id="password"
                    />
                    {/* button show password */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                      onClick={() =>
                        setFormData((prevFormData) => ({
                          ...prevFormData, // คัดลอกค่าที่เหลือใน formData
                          showPassword: !prevFormData.showPassword, // อัปเดตเฉพาะ showPassword
                        }))
                      }
                    >
                      {formData.showPassword ? (
                        /** icon open eye **/
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                        </svg>
                      ) : (
                        /** icon close eye **/
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-eye-slash-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <button
                className="w-auto h-auto px-12 py-2 mt-5 shadow font-extrabold text-sm text-white bg-[#FFA24C] rounded-lg hover:bg-[#FFAF00] focus:ring-4 focus:outline-none focus:ring-yellow-400"
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
export default AddNewUser;

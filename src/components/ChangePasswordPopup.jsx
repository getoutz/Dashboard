import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function ChangePasswordPopup({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [userId, setUserId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setUserId(session.uid);
      ///console.log(session.uid);
    }
  }, []);

  const handleCloseChangePasswordPopup = (event) => {
    event.preventDefault();
    onClose();
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePasswordPopup = (event) => {
    event.preventDefault();
    // ตรวจสอบข้อมูลในแต่ละช่อง input
    if (oldPassword === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก Old Password!",
        icon: "error",
      }).then(() => {
        document.getElementById("old-password").focus(); // ตั้งโฟกัสที่ช่อง Old Password
      });
      return;
    }

    if (newPassword === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก New Password!",
        icon: "error",
      }).then(() => {
        document.getElementById("new-password").focus(); // ตั้งโฟกัสที่ช่อง New Password
      });
      return;
    }

    if (confirmPassword === "") {
      Swal.fire({
        title: "Error",
        text: "กรุณากรอก Confirm Password!",
        icon: "error",
      }).then(() => {
        document.getElementById("confirm-password").focus(); // ตั้งโฟกัสที่ช่อง Confirm Password
      });
      return;
    }

    // ยืนยันรหัสผ่านใหม่
    Swal.fire({
      title: "Change New Password",
      text: "ยืนยันแก้ไขรหัสผ่านใหม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1AACAC",
      cancelButtonColor: "#E2DAD6",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        postUserData();
      }
    });
  };

  const postUserData = async () => {
    try {
      const url = `http://192.168.1.150/changepassword
`;
      let userData = {
        uid: userId,
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      };

      const result = await axios.post(url, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "081676cca5f9124d7cc5ca761f45bb31",
        },
      });
      console.log(userData.uid);
      console.log(userData.old_password);
      console.log(userData.new_password);
      console.log(userData.confirm_new_password);

      document.getElementById("change_password_modal").close(); // Close the modal
      if (result.data.status === 200) {
        // Show success message after the project is added
        Swal.fire({
          title: "Change new password",
          text: "แก้ไขรหัสผ่านสำเร็จ !",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page when the user clicks "OK"
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: "Change new password",
          text: "แก้ไขรหัสผ่านไม่สำเร็จ !",
          icon: "error",
        });
        setTimeout(() => {
          window.location.reload();
        }, 500); // หน่วงเวลา 2 วินาที (2000 มิลลิวินาที)
      }
    } catch (error) {
      Swal.fire("Error", "Failed to add project. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <dialog
        id="change_password_modal"
        className="modal overflow-visible"
        open
      >
        <div className="modal-box bg-white text-black lg:overflow-visible lg:w-3/5 w-auto px-10 max-h-[100vh] flex flex-col overflow-y-auto relative z-[100] rounded-md">
          <button
            onClick={handleCloseChangePasswordPopup}
            className="shadow btn btn-sm btn-circle rounded-lg hover:bg-[#FA4032] hover:border-none bg-red-500 text-white absolute right-1 top-1"
          >
            ✕
          </button>
          <header className="w-full h-full border-b border-gray-200 mb-5">
            <h3 className="font-extrabold text-xl mb-5 font-LexendDeca flex flex-row items-center gap-2 text-[#758694]">
              <div className="text-[#B7B7B7]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-shield-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
                  />
                </svg>
              </div>{" "}
              Change New Password
            </h3>
          </header>
          <form onSubmit={handleChangePasswordPopup}>
            <div className="flex flex-col flex-grow gap-4 mt-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="old-password"
                  className="text-[#45474B] font-medium font-LexendDeca"
                >
                  <span className="text-red-600 font-bold">*</span> Old Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Type here.."
                    className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    id="old-password"
                    value={oldPassword}
                    autoComplete="off"
                    onChange={(event) => setOldPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-slash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="new-password"
                  className="font-medium font-LexendDeca"
                >
                  <span className="text-red-600 font-bold">*</span> New Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Type here.."
                    className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    id="new-password"
                    value={newPassword}
                    autoComplete="off"
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-slash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirm-password"
                  className="font-medium font-LexendDeca"
                >
                  <span className="text-red-600 font-bold">*</span> Confirm
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Type here.."
                    className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                    id="confirm-password"
                    value={confirmPassword}
                    autoComplete="off"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-eye-slash-fill"
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
            <div className="flex justify-center mt-5">
              <button
                className="w-auto h-auto px-12 py-2 rounded-lg mt-5 shadow font-medium font-LexendDeca text-sm text-white bg-[#FFA24C] hover:bg-[#FFAF00] focus:ring-4 focus:outline-none focus:ring-yellow-400 dark:focus:ring-orange-800"
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
}

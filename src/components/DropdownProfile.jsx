import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Transition from "../utils/Transition";
import UserAvatar from "../images/profile.jpg";

import { ChangePasswordPopup } from "../components/ChangePasswordPopup";

function DropdownProfile({ align }) {
  const [session, setSession] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // เพิ่ม state สำหรับ popup

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setSession(session);
    }
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleOpenPopup = () => {
    setDropdownOpen(false); // ปิด dropdown ก่อน
    setTimeout(() => {
      setIsPopupOpen(true); // เปิด popup หลัง dropdown ปิดสนิท
    }, 150); // หน่วงเวลาเล็กน้อย
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // ปิด popup
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={UserAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {session.surname} {session.lastname}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
          <span className="font-thin text-gray-300 text-sm">V.1.1 (9/12/2024)</span>
          <div className="font-NotoSansThai">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-normal text-sm">ชื่อผู้ใช้: </span>
              <span className="text-orange-500 font-semibold text-sm">
                {session.username}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-normal text-sm">ตำแหน่ง: </span>
              <span className="text-orange-500 font-semibold text-sm">
                {session.position}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 ">
              <span className="font-normal text-sm">แผนก: </span>
              <span className="text-orange-500 font-semibold text-sm">
                {session.department}
              </span>
            </div>
          </div>
          </div>
          <ul>
            <li>
              <div
                className="font-medium text-[14px] text-gray-600 hover:text-orange-600 dark:hover:text-orange-400 flex items-center py-1 px-3 cursor-pointer"
                onClick={handleOpenPopup}
              >
                Change Password
              </div>
            </li>
            <li>
              <Link
                className="font-medium text-[14px] text-gray-600 hover:text-orange-600 dark:hover:text-violet-400 flex items-center gap-3 py-1 px-3"
                onClick={async () => {
                  sessionStorage.removeItem("userSession"); // ลบข้อมูล session
                  await Toast.fire({
                    icon: "success",
                    title: "ล็อคเอ้าท์สำเร็จ",
                  });
                  window.location.href = "/login";
                }}
              >
                Logout{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
              </Link>
            </li>
          </ul>
          
        </div>
      </Transition>

      {/* Popup */}
      <ChangePasswordPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </div>
  );
}

export default DropdownProfile;

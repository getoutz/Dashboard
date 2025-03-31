import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AddNewUser from "../../components/AddNewUserPopup";

function ManageUserTable() {
  const [formData, setFormData] = useState({
    showListUserAccount: [],
    searchText: "",
    username: "",
  });
  const popupRef = useRef();

  const getAllUserAccount = async () => {
    const url = `http://192.168.1.150/viewlistuser`;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "86fcdcba83e6b8bf98c2ac5dbf472fda",
      },
    });
    setFormData((prevData) => ({
      ...prevData,
      showListUserAccount: result.data.data,
    }));
  };
  

  const filteredUserAccount = formData.showListUserAccount.filter((user) => {
    const statusText = user.status == 1 ? "เปิดใช้งาน" : "เลิกใช้งาน";
    const matchesText =
      user.username.toLowerCase().includes(formData.searchText.toLowerCase()) ||
      user.surname.toLowerCase().includes(formData.searchText.toLowerCase()) ||
      user.lastname.toLowerCase().includes(formData.searchText.toLowerCase()) ||
      user.position.toLowerCase().includes(formData.searchText.toLowerCase()) ||
      user.department.toLowerCase().includes(formData.searchText.toLowerCase()) ||
      statusText.includes(formData.searchText); // ค้นหาจากข้อความที่แปลงแล้ว
    return matchesText;
  });

  const handleAddUser = () => {
    // console.log("popupRef:", popupRef.current);
    popupRef.current?.openPopup();
  };

  useEffect(() => {
    getAllUserAccount();
  }, []);

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevData) => ({
        ...prevData, // คัดลอกค่าที่มีอยู่เดิมใน formData
        username: session, // อัปเดตเฉพาะ username
      }));
    }
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-xl font-Quicksand col-span-full xl:col-span-6">
      <header className="border-b border-gray-100 px-3 py-4 flex items-center justify-between">
        <h1 className="font-LexendDeca font-bold text-gray-800 text-xl">
          Manage User Account
        </h1>
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 font-medium text-sm text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                {/* icon search */}
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
                className="block w-full h-12 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search.."
                value={formData.searchText}
                onChange={(event) => setFormData((prevData) => ({
                  ...prevData,
                  searchText: event.target.value,
                }))}
              />
            </div>
          </form>
          {/* Add view button */}
          <button
            onClick={handleAddUser}
            className="shadow flex flex-row gap-3 btn bg-gradient-to-r from-[#FF4D00] to-[#FFC002] hover:from-pink-500 hover:via-orange-500 hover:to-orange-600 active:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-300 justify-center w-full h-auto py-3 px-10 text-sm font-semibold tracking-wider text-white bg-[#f16a2b] hover:bg-[#f16a2b]"
          >
            {/* icon add */}
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
            <span className="max-xs:sr-only">New User</span>
          </button>
          {/* Popup Component */}
            <AddNewUser ref={popupRef} />
        </div>
      </header>
      {/* Table */}
      <div className="p-3 overflow-x-auto font-medium h-[calc(100vh-200px)]">
        <div className="relative h-full overflow-y-auto">
          <table className="table-auto w-full">
            <thead className="sticky top-0 z-10 font-bold uppercase text-xs text-center text-white bg-[#A0937D]">
              <tr>
                <th className="p-2 whitespace-nowrap">USERNAME</th>
                <th className="p-2 whitespace-nowrap">FULL NAME</th>
                <th className="p-2 whitespace-nowrap">POSITION</th>
                <th className="p-2 whitespace-nowrap">DEPARTMENT</th>
                <th className="p-2 whitespace-nowrap">STATUS</th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm divide-y divide-gray-100">
              {filteredUserAccount && filteredUserAccount.length > 0 ? (
                filteredUserAccount.map((user, idx) => (       
                    <tr
                    key={user.id || idx} // ใช้ id ถ้ามี ถ้าไม่มีใช้ idx
                      className={`text-center cursor-pointer ${
                        idx % 2 == 0
                          ? "bg-white text-[#C58940]"
                          : "bg-[#F7F4EA] text-[#61481C]"
                      }`} // สลับสีแถวโดยใช้เงื่อนไข idx % 2
                    >
                      <td className="p-2 whitespace-nowrap">{user.username}</td>
                      <td
                        className="p-2 whitespace-nowrap font-NotoSansThai font-normal"
                      >
                        {user.surname} {user.lastname}
                      </td>
                      <td className="p-2 whitespace-nowrap">{user.position}</td>
                      <td className="p-2 whitespace-nowrap">
                        {user.department}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span
                          className={`font-NotoSansThai font-light ${
                            user.status == 1 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {user.status == 1 ? "เปิดใช้งาน" : "เลิกใช้งาน"}
                        </span>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No project data available
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
export default ManageUserTable;

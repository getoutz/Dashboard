import React, { useState, useEffect, useRef, forwardRef } from "react";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css";

const CalendarInput = forwardRef(({ date, setDate, id, disabled }, ref) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [position, setPosition] = useState("bottom");
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useRef(null); // ใช้ ref เพื่อตรวจสอบตำแหน่ง calendar

  const clearDate = () => {
    setSelectedDate(null);
    setDate(null); // ตั้งค่าให้เป็น null เพื่อให้ formData อัปเดต
  };
  
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
      setDate(date);
    }
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (date && date instanceof Date && !isNaN(date)) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      if (day === 1 && month === 1 && year === 1970) {
        setSelectedDate(null);
      } else {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [date]);

  useEffect(() => {
    if (showCalendar && ref?.current) {
      const inputRect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [showCalendar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // ตรวจสอบว่าหน้าจอเป็นมือถือ
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      {disabled ? (
        <input
          type="text"
          id={id}
          value={formatDate(selectedDate)}
          placeholder="Select a date"
          className="border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 w-full h-full bg-gray-100 cursor-not-allowed pl-10 pr-4 py-2 border border-gray-300 sm:text-sm text-gray-900 placeholder-gray-400"
          readOnly
        />
      ) : (
        <div className="relative w-full">
          <input
            type="text"
            id={id}
            ref={ref}
            value={formatDate(selectedDate) || "Select a date"}
            placeholder="Select a date"
            readOnly
            onClick={() => setShowCalendar(!showCalendar)}
            className="border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 w-full h-full bg-white pl-10 pr-4 py-2 sm:text-sm text-gray-900"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar3"
              viewBox="0 0 16 16"
            >
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
          </div>

          {showCalendar && (
            <motion.div
              ref={calendarRef}
              className={`${
                isMobile
                  ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                  : "absolute top-full mt-2 left-0 z-50"
              } rounded-lg`}
            >
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCalendar(false)}
              >
                ✕
              </button>

              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="bg-white shadow-md p-2 rounded-lg"
                locale="en"
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
});
export default CalendarInput;

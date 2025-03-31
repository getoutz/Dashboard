import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserMenu from "../components/DropdownProfile";
import { Link } from 'react-router-dom';

function Header({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null); // ปรับให้เริ่มต้นเป็น null

  // ตรวจสอบ session และเปลี่ยนสถานะการล็อกอิน
  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setIsAuthenticated(true);
      setSession(session);
    }
  }, []);

  const checkPosition = (allowedPositions) => {
    return allowedPositions.includes(session?.position);
  };

  // ฟังก์ชันตรวจสอบ department
  const checkDepartment = (allowedDepartment) => {
    if (!session || !session.department) {
      return false; // ป้องกันข้อผิดพลาดเมื่อ session.department ว่าง
    }
    return allowedDepartment.includes(session.department);
  };

  const checkPermission = (allowedPermissions) => {
    if (!session || !session.permission) {
      return false; // ป้องกันข้อผิดพลาดเมื่อ session.department ว่าง
    }
    return allowedPermissions.includes(session.permission);
  };

  return (
    <header
      className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${
        variant === "v2" || variant === "v3"
          ? "before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10"
          : "max-lg:shadow-sm lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90"
      } ${variant === "v2" ? "dark:before:bg-gray-800" : ""} ${
        variant === "v3" ? "dark:before:bg-gray-900" : ""
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-14 ${
            variant === "v2" || variant === "v3"
              ? ""
              : "lg:border-b border-gray-200 dark:border-gray-700/60"
          }`}
        >
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

            <div className="breadcrumbs text-sm">
              {/* แสดงข้อมูลเฉพาะแผนก Planning */}
              {checkDepartment(["Planning"]) || checkPermission(["Admin"]) ? (
                <ul>
                  <li>
                  {(location.pathname === "/planning/manageproject" && !location.pathname.startsWith("/editProject/")) ? (
                    <li>Manage Project</li>
                  ) : null }
                    {
                    location.pathname === "/addNewProject" ||
                    location.pathname.startsWith("/editProject/") ? ( // ใช้ .startsWith() แทน ===
                      <Link to="/planning/manageproject">Manage Project</Link>
                    ) : null}
                  </li>
                  {location.pathname === "/addNewProject" && (
                    <li>Add New Project</li>
                  )}
                   {location.pathname.startsWith("/editProject/") && <li>Edit Project</li>} {/* แก้ตรงนี้ */}
                </ul>
              ) : 
                checkDepartment(["Design"]) || checkPermission(["Admin"]) || checkPosition(["Manager"]) ? (
                  <ul>
                      {location.pathname === "/design/allproject" && (
                        <li>
                        <Link to="/">All Project</Link>
                        </li>
                      )}
                    
                      {
                      location.pathname === "/design/manageproject" && (
                        <li>
                        <Link to="/design/manageproject">Manage Project</Link>
                        </li>
                      )}
        
                  </ul>
                ) : (
                  checkDepartment(["Automation"]) || checkPermission(["Admin"]) ? (
                    <ul>
                        {location.pathname === "/automation/allproject" && (
                          <li>
                          <Link to="/">All Project</Link>
                          </li>
                        )}
                        {
                        location.pathname === "/automation/manageproject" && (
                          <li>
                          <Link to="/automation/manageproject">Manage Project</Link>
                          </li>
                        )}
                      
                    </ul>
                  ) : 
                  checkDepartment(["Program"]) || checkPermission(["Admin"]) || checkPosition(["Manager"]) ? (
                    <ul>
                        {location.pathname === "/programmer/allproject" && (
                          <li>
                          <Link to="/">All Project</Link>
                          </li>
                        )}
                        {
                        location.pathname === "/programmer/manageproject" && (
                          <li>
                          <Link to="/programmer/manageproject">Manage Project</Link>
                          </li>
                        )}
          
                    </ul>
                  )
                 : (
                  checkDepartment(["Purchase"]) || checkPermission(["Admin"]) ? (
                    <ul>
                      
                        {location.pathname === "/purchase/manageproject" 
                        // || location.pathname === "/editProject"
                         ? (
                          <li>
                          <Link to="/manageproject">Manage Project</Link>
                          </li>
                        ) : null}
                      {/* {location.pathname === "/editProject" && <li>Edit Project</li>} */}
                      {location.pathname === "/purchase/myproject" 
                      ? (
                          <li>
                          <Link to="/myproject">My Project</Link>
                          </li>
                        ) : null}
                        {/* {location.pathname === "/updateProject" && (
                      <li>Update Project</li>
                    )} */}
                    </ul>
                  ) : null
                )
              )}
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

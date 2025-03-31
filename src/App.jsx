import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./css/style.css";
import "./charts/ChartjsConfig";

import Login from "./pages/Login";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |A|D|M|I|N|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+
*/

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminManageUser from "./pages/Admin/ManageUser";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |S|A|L|E|S|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+
*/

import SalesManageProject from "./pages/Sales/ManageProject";
import SalesAllProject from "./pages/Sales/AllProject";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |P|L|A|N|N|I|N|G|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+-+
*/

import PlanningManageProject from "./pages/Planning/ManageProject";
import AddNewProject from "./pages/Planning/AddNewProject";
import EditProject from "./pages/EditProject";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |D|E|S|I|G|N|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+
*/

import DesignManageProject from "./pages/Design/ManageProject";
import DesignAllProject from "./pages/Design/AllProject";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |A|U|T|O|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+
*/

import AutomationManageProject from "./pages/Automation/ManageProject";
import AutomationAllProject from "./pages/Automation/AllProject";

/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |P|R|O|G|R|A|M|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+
*/

import ProgrammerManageProject from "./pages/Programmer/ManageProject";
import ProgrammerAllProject from "./pages/Programmer/AllProject";
/*
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+-+
 |I|M|P|O|R|T| |P|A|G|E|S| |P|U|R|C|H|A|S|E|
 +-+-+-+-+-+-+ +-+-+-+-+-+ +-+-+-+-+-+-+-+-+
*/

import PurchaseManageProject from "./pages/Purchase/ManageProject";
import PurchaseMyProject from "./pages/Purchase/MyProject";
import PurchaseAllProject from "./pages/Purchase/AllProject";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState("");

  // ตรวจสอบ session และเปลี่ยนสถานะการล็อกอิน
  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem("userSession");
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        if (sessionData && sessionData.username) {
          // ตรวจสอบว่ามีข้อมูล username หรือไม่
          setIsAuthenticated(true);
          setSession(sessionData);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error parsing session:", error);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const lastPage = sessionStorage.getItem("lastPage");
      if (lastPage && location.pathname === "/") {
        navigate(lastPage, { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // บันทึก path ล่าสุดลงใน sessionStorage ทุกครั้งที่ path เปลี่ยน
  useEffect(() => {
    if (isAuthenticated) {
      const lastPage = sessionStorage.getItem("lastPage");
      if (lastPage && location.pathname === "/") {
        navigate(lastPage, { replace: true });
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // นำทางไปยัง path ล่าสุดเมื่อเข้าถึง / หรือ /login
  useEffect(() => {
    if (isAuthenticated && location?.pathname) {
      const lastPage = sessionStorage.getItem("lastPage");
      if (
        lastPage &&
        (location.pathname === "/" || location.pathname === "/login")
      ) {
        navigate(lastPage, { replace: true });
      }
    }
  }, [isAuthenticated, location?.pathname, navigate]);

  // เลื่อนกลับไปบนสุดของหน้าเมื่อมีการเปลี่ยนแปลงเส้นทาง
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  const checkPosition = (allowedPositions) => {
    return allowedPositions.includes(session?.position);
  };
  const checkPermission = (allowedPermissions) => {
    return allowedPermissions.includes(session?.permission);
  };
  const checkDepartment = (allowedDepartment) => {
    return allowedDepartment.includes(session?.department);
  };

  return (
    <>
      <Routes>
        {/* หน้า Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              checkPermission(["Admin"]) ? (
                <Navigate to="/admin/manageuser" replace /> // ถ้าเป็น แอดมิน path เริ่มต้นจะเป็นหน้า manageuser
              ) : checkDepartment(["Sales Engineer"]) ? (
                <Navigate to="/sales/allproject" replace /> // ถ้าเป็นแผนก Sales path เริ่มต้นจะเป็นหน้า Sales/Allproject
              ) : checkDepartment(["Design"]) || checkPosition(["Manager"]) ? (
                <Navigate to="/design/allproject" replace /> // ถ้าเป็นแผนก Design path เริ่มต้นจะเป็นหน้า Design/Allproject
              ) : checkDepartment(["Automation"]) ? (
                <Navigate to="/automation/allproject" replace /> // ถ้าเป็นแผนก Automation path เริ่มต้นจะเป็นหน้า Automation/Allproject
              ) : checkDepartment(["Program"]) ? (
                <Navigate to="/programmer/allproject" replace /> // ถ้าเป็นแผนก Program path เริ่มต้นจะเป็นหน้า Programmer/Allproject
              ) : checkDepartment(["Purchase"]) ? (
                <Navigate to="/purchase/allproject" replace />
              ) : checkDepartment(["Planning"]) ? (
                <Navigate to="/planning/manageproject" replace />
              ) : null
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              checkPermission(["Admin"]) ? (
                <Navigate to="/admin/manageuser" replace /> // ถ้าเป็น แอดมิน path เริ่มต้นจะเป็นหน้า manageuser
              ) : checkDepartment(["Sales Engineer"]) ? (
                <Navigate to="/sales/allproject" replace /> // ถ้าเป็นแผนก Sales path เริ่มต้นจะเป็นหน้า Sales/Allproject
              ) : checkDepartment(["Design"]) || checkPosition(["Manager"]) ? (
                <Navigate to="/design/allproject" replace /> // ถ้าเป็นแผนก Design path เริ่มต้นจะเป็นหน้า Design/Allproject
              ) : checkDepartment(["Automation"]) ? (
                <Navigate to="/automation/allproject" replace /> // ถ้าเป็นแผนก Automation path เริ่มต้นจะเป็นหน้า Automation/Allproject
              ) : checkDepartment(["Program"]) ? (
                <Navigate to="/programmer/allproject" replace /> // ถ้าเป็นแผนก Programmer path เริ่มต้นจะเป็นหน้า Programmer/Allproject
              ) : checkDepartment(["Purchase"]) ? (
                <Navigate to="/purchase/allproject" replace />
              ) : checkDepartment(["Planning"]) ? (
                <Navigate to="/planning/manageproject" replace />
              ) : null
            ) : (
              <Login />
            )
          }
        />
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated &&
            (checkPosition(["Manager"]) ||
              checkPermission(["Admin"]) ||
              session.username === "getout") ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/manageuser"
          element={
            isAuthenticated &&
            (checkPosition(["Manager"]) ||
              checkPermission(["Admin"]) ||
              session.username === "getout") ? (
              <AdminManageUser />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* แผนก Sales */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        <Route
          path="/sales/manageproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Sales Engineer", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <SalesManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/sales/allproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Sales Engineer", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <SalesAllProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* แผนก Design */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        <Route
          path="/design/manageproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Design", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <DesignManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/design/allproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Design", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <DesignAllProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* แผนก Automatoin */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        <Route
          path="/automation/manageproject"
          element={
            isAuthenticated &&
            ((checkDepartment(["Automation"]) &&
              checkPosition(["Supervisor", "Team Leader", "Team Assistant"])) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"]) ||
              checkDepartment(["Planning"])) ? (
              <AutomationManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/automation/allproject"
          element={
            isAuthenticated &&
            (checkPosition(["Manager", "President"]) ||
              checkDepartment(["Automation", "Planning"]) ||
              checkPermission(["Admin"])) ? (
              <AutomationAllProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* แผนก Programmer */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        <Route
          path="/programmer/manageproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Program", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <ProgrammerManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/programmer/allproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Program", "Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <ProgrammerAllProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* แผนก Purchase */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        {/* <Route
          path="/purchase/manageproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Purchase"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <PurchaseManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}
        {/* ตำแหน่งสตาฟหรือพนักงาน */}
        <Route
          path="/purchase/myproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Purchase"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager"])) ? (
              <PurchaseMyProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/purchase/allproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Purchase"]) || checkPermission(["Admin"])) ? (
              <PurchaseAllProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* แผนก Planning */}
        {/* ตำแหน่งหัวหน้าหรือสูงกว่า */}
        <Route
          path="/planning/manageproject"
          element={
            isAuthenticated &&
            (checkDepartment(["Planning"]) ||
              checkPermission(["Admin"]) ||
              checkPosition(["Manager", "President"])) ? (
              <PlanningManageProject />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/addNewProject" element={<AddNewProject />} />
        <Route path="/editProject/:projectId" element={<EditProject />} />
      </Routes>
    </>
  );
}

export default App;

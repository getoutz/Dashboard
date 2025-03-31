import axios from "axios";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import CalendarInput from "../components/Calendar";
import "react-datepicker/dist/react-datepicker.css";

const EditProject = forwardRef((props, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    workbomNo: "",
    projectName: "",
    customer: "",
    projectStart: null,
    projectEnd: null,
    projectDetail: "",
    /** Department **/
    checkedSales: 0,
    checkedDesign: 0,
    checkedPurchase: 0,
    checkedAutomation: 0,
    checkedProgrammer: 0,
    /** Sales Department **/
    salesStartDate: null,
    salesEndDate: null,
    selectedSalesEngineer: [],
    searchSalesEngineer: "",
    salesEngineerList: [],
    highlightedIndexSales: -1,
    isTypingSalesEngineer: false,
    showInputSalesEngineer: false,
    statusConceptSales: 1,
    statusPO: 1,
    statusDelivery: 1,
    statusINV: 1,
    statusADD: 1,
    statusSuccessSales: 1,
    deadlineConceptSales: null,
    deadlinePO: null,
    deadlineDelivery: null,
    deadlineINV: null,
    deadlineADD: null,
    /** Design Engineer **/
    designStartDate: null,
    designEndDate: null,
    selectedDesignEngineer: [],
    searchDesignEngineer: "",
    designEngineerList: [],
    highlightedIndexDesign: -1,
    isTypingDesignEngineer: false,
    showInputDesignEngineer: false,
    statusConceptDesign: 1,
    status3D: 1,
    status2D: 1,
    statusPR: 1,
    statusSuccessDesign: 1,
    deadlineConceptDesign: null,
    deadline3D: null,
    deadline2D: null,
    deadlinePR: null,
    /** Automation **/
    autoStartDate: null,
    autoEndDate: null,
    selectedAutomation: [],
    searchAutomation: "",
    automationList: [],
    highlightedIndexAutomation: -1,
    isTypingAutomation: false,
    showInputAutomation: false,
    statusElectrical: 1,
    statusMechanic: 1,
    statusInstall: 1,
    statusTestRun: 1,
    statusSafetyCheck: 1,
    statusSuccessAuto: 1,
    deadlineElectrical: null,
    deadlineMechanic: null,
    deadlineInstall: null,
    deadlineTestRun: null,
    deadlineSafetyCheck: null,
    /** Programmer **/
    programmerStartDate: null,
    programmerEndDate: null,
    selectedProgrammer: [],
    searchProgrammer: "",
    programmerList: [],
    highlightedIndexProgrammer: -1,
    isTypingProgrammer: false,
    showInputProgrammer: false,
    statusConceptProgrammer: 1,
    statusBackup: 1,
    statusProgram: 1,
    statusManual: 1,
    statusSaveFile: 1,
    deadlineConceptProgrammer: null,
    deadlineBackup: null,
    deadlineProgram: null,
    deadlineManual: null,
    deadlineSaveFile: null
  });
  let dataWB = project?.workbom_data;
  let dataSales = project?.sale_data;
  let dataDesign = project?.design_data;
  let dataAuto = project?.automation_data;
  let dataProgrammer = project?.programmer_data;
  const { projectId } = useParams();
  //console.log("Data Design:", dataDesign); // เช็คค่า projectId

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.150/planning_getdatatoedit?id=${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bcfd16ca5df1615f1053aca6490419f5",
            },
          }
        );
        //console.log("Fetched Project Data:", response.data.data);
        setProject(response.data.data);
        console.log("Fetched Project Data:", response.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // ตรวจสอบ session และเปลี่ยนสถานะการล็อกอิน
  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setIsAuthenticated(true);
      setSession(session);
    }
  }, []);

  // 📌 อัปเดต `formData` เมื่อ `project` เปลี่ยนแปลง
  useEffect(() => {
    if (dataWB?.project_start && dataWB?.project_end) {
      setFormData((prev) => {
        const updatedForm = {
          ...prev,
          workbomNo: dataWB?.workbom_no || "",
          projectName: dataWB?.project_name || "",
          customer: dataWB?.project_owner || "",
          selectedSalesEngineer:
            typeof dataSales?.person_user === "string"
              ? dataSales.person_user.split(",").map((name) => name.trim()) // ✅ แปลงเป็น Array
              : [],
          selectedDesignEngineer:
            typeof dataDesign?.person_user === "string"
              ? dataDesign.person_user.split(",").map((name) => name.trim()) // ✅ แปลงเป็น Array
              : [],
          selectedAutomation:
            typeof dataAuto?.person_user === "string"
              ? dataAuto.person_user.split(",").map((name) => name.trim()) // ✅ แปลงเป็น Array
              : [],
          selectedProgrammer:
            typeof dataProgrammer?.person_user === "string"
              ? dataProgrammer.person_user.split(",").map((name) => name.trim()) // ✅ แปลงเป็น Array
              : [],
          projectStart: new Date(dataWB?.project_start), // เก็บในรูปแบบ Date object
          projectEnd: new Date(dataWB?.project_end), // เก็บในรูปแบบ Date object
          salesStartDate: new Date(dataSales?.timeline.start),
          salesEndDate: new Date(dataSales?.timeline.end),
          designStartDate: new Date(dataDesign?.timeline.start),
          designEndDate: new Date(dataDesign?.timeline.end),
          autoStartDate: new Date(dataAuto?.timeline.start),
          autoEndDate: new Date(dataAuto?.timeline.end),
          programmerStartDate: new Date(dataProgrammer?.timeline.start),
          programmerEndDate: new Date(dataProgrammer?.timeline.end),
          projectDetail: dataWB?.project_detail || "",
          checkedSales: dataWB?.dp_sales || 0,
          checkedDesign: dataWB?.dp_design || 0,
          checkedPurchase: dataWB?.dp_purchase || 0,
          checkedAutomation: dataWB?.dp_automation || 0,
          checkedProgrammer: dataWB?.dp_program || 0,
          statusConceptDesign: dataDesign?.concept.status || 1,
          status3D: dataDesign?.design_3d.status || 1,
          status2D: dataDesign?.design_2d.status || 1,
          statusPR: dataDesign?.pr.status || 1,
          statusSuccessDesign: dataDesign?.success.status || 1,
          deadlineConceptDesign: new Date(dataDesign?.concept.deadline),
          deadline3D: new Date(dataDesign?.design_3d.deadline),
          deadline2D: new Date(dataDesign?.design_2d.deadline),
          deadlinePR: new Date(dataDesign?.pr.deadline),
          statusElectrical: dataAuto?.electrical.status || 1,
          statusMechanic: dataAuto?.mechanic.status || 1,
          statusInstall: dataAuto?.program.status || 1,
          statusSafetyCheck: dataAuto?.safety_check.status || 1,
          statusTestRun: dataAuto?.test_run.status || 1,
          statusSuccessAuto: dataAuto?.success.status || 1,
          deadlineElectrical: new Date(dataAuto?.electrical.deadline),
          deadlineMechanic: new Date(dataAuto?.mechanic.deadline),
          deadlineInstall: new Date(dataAuto?.program.deadline),
          deadlineSafetyCheck: new Date(dataAuto?.safety_check.deadline),
          deadlineTestRun: new Date(dataAuto?.test_run.deadline),
          statusConceptSales: dataSales?.concept.status || 1,
          statusPO: dataSales?.po.status || 1,
          statusDelivery: dataSales?.delivery.status || 1,
          statusINV: dataSales?.invoice.status || 1,
          statusADD: dataSales?.addition.status || 1,
          statusSuccessSales: dataSales?.success.status || 1,
          deadlineConceptSales: new Date(dataSales?.concept.deadline),
          deadlinePO: new Date(dataSales?.po.deadline),
          deadlineDelivery: new Date(dataSales?.delivery.deadline),
          deadlineINV: new Date(dataSales?.invoice.deadline),
          deadlineADD: new Date(dataSales?.addition.deadline),
          statusConceptProgrammer: dataProgrammer?.concept.status || 1,
          statusBackup: dataProgrammer?.backup.status || 1,
          statusProgram: dataProgrammer?.program.status || 1,
          statusManual: dataProgrammer?.manual.status || 1,
          statusSaveFile: dataProgrammer?.savefile.status || 1,
          deadlineConceptProgrammer: new Date(dataProgrammer?.concept.deadline),
          deadlineBackup: new Date(dataProgrammer?.backup.deadline),
          deadlineProgram: new Date(dataProgrammer?.program.deadline),
          deadlineManual: new Date(dataProgrammer?.manual.deadline),
          deadlineSaveFile: new Date(dataProgrammer?.savefile.deadline),
          username:
            JSON.parse(sessionStorage.getItem("userSession"))?.username || "",
        };
        console.log("✅ Updated selected:", updatedForm);
        // console.log(
        //   "✅ Updated selectedDesignEngineer:",
        //   updatedForm.selectedDesignEngineer
        // );
        return updatedForm;
      });
    } else {
      console.log("⚠️ วันที่เริ่มต้นหรือสิ้นสุดไม่ถูกต้อง");
    }
  }, [project]);

  const workbomNoRef = useRef(null);
  const projectNameRef = useRef(null);
  const customerRef = useRef(null);
  const projectStartRef = useRef(null);
  const projectEndRef = useRef(null);
  const projectDetailRef = useRef(null);
  /** Department **/
  const salesDepartmentRef = useRef(null);
  const designDepartmentRef = useRef(null);
  const automationDepartmentRef = useRef(null);
  const programmerDepartmentRef = useRef(null);
  /** Sales Engineer **/
  const salesEngineerRef = useRef(null);
  const salesStartDateRef = useRef(null);
  const salesEndDateRef = useRef(null);
  const deadlineConceptSalesRef = useRef(null);
  const deadlinePORef = useRef(null);
  const deadlineDeliveryRef = useRef(null);
  const deadlineINVRef = useRef(null);
  const deadlineADDRef = useRef(null);
  /** Design Engineer **/
  const designEngineerRef = useRef(null);
  const designStartDateRef = useRef(null);
  const designEndDateRef = useRef(null);
  const deadlineConceptRef = useRef(null);
  const deadline2DRef = useRef(null);
  const deadline3DRef = useRef(null);
  const deadlinePRRef = useRef(null);
  /** Automation **/
  const automationRef = useRef(null);
  const autoStartDateRef = useRef(null);
  const autoEndDateRef = useRef(null);
  const deadlineElectricalRef = useRef(null);
  const deadlineMechanicRef = useRef(null);
  const deadlineInstallRef = useRef(null);
  const deadlineSafetyCheckRef = useRef(null);
  const deadlineTestRunRef = useRef(null);
  /** Programmer **/
  const programmerRef = useRef(null);
  const programmerStartDateRef = useRef(null);
  const programmerEndDateRef = useRef(null);

  const editProject = async () => {
    try {
      const formatDateToYYYYMMDD = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d)) return null;

        return `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
      };

      const formattedProjectStart = formatDateToYYYYMMDD(
        formData.projectStart,
        "projectstart"
      );
      const formattedProjectEnd = formatDateToYYYYMMDD(
        formData.projectEnd,
        "projectend"
      );

      const formattedSalesStartDate = formatDateToYYYYMMDD(
        formData.salesStartDate,
        "sales startdate"
      );
      const formattedSalesEndDate = formatDateToYYYYMMDD(
        formData.salesEndDate,
        "sales enddate"
      );
      const formattedDeadlineConceptSales =
        formData.statusConceptSales == 2
          ? formatDateToYYYYMMDD(
              formData.deadlineConceptSales,
              "deadline concept sales"
            )
          : null;
      const formattedDeadlinePO =
        formData.statusPO == 2
          ? formatDateToYYYYMMDD(formData.deadlinePO, "deadline po")
          : null;
      const formattedDeadlineDelivery =
        formData.statusDelivery == 2
          ? formatDateToYYYYMMDD(formData.deadlineDelivery, "deadline delivery")
          : null;
      const formattedDeadlineINV =
        formData.statusINV == 2
          ? formatDateToYYYYMMDD(formData.deadlineINV, "deadline inv")
          : null;
      const formattedDeadlineADD =
        formData.statusADD == 2
          ? formatDateToYYYYMMDD(formData.deadlineADD, "deadline add")
          : null;

      const formattedDesignStartDate = formatDateToYYYYMMDD(
        formData.designStartDate,
        "design startdate"
      );
      const formattedDesignEndDate = formatDateToYYYYMMDD(
        formData.designEndDate,
        "design enddate"
      );
      const formattedDeadlineConceptDesign =
        formData.statusConceptDesign == 2
          ? formatDateToYYYYMMDD(
              formData.deadlineConceptDesign,
              "deadline concept design"
            )
          : null;
      const formattedDeadline3D =
        formData.status3D == 2
          ? formatDateToYYYYMMDD(formData.deadline3D, "deadline 3d")
          : null;
      const formattedDeadline2D =
        formData.status2D == 2
          ? formatDateToYYYYMMDD(formData.deadline2D, "deadline 2d")
          : null;
      const formattedDeadlinePR =
        formData.statusPR == 2
          ? formatDateToYYYYMMDD(formData.deadlinePR, "deadline pr")
          : null;
      const formattedAutoStartDate = formatDateToYYYYMMDD(
        formData.autoStartDate,
        "auto startdate"
      );
      const formattedAutoEndDate = formatDateToYYYYMMDD(
        formData.autoEndDate,
        "auto enddate"
      );
      const formattedDeadlineElectrical =
        formData.statusElectrical == 2
          ? formatDateToYYYYMMDD(
              formData.deadlineElectrical,
              "deadline electrical"
            )
          : null;
      const formattedDeadlineMechanic =
        formData.statusMechanic == 2
          ? formatDateToYYYYMMDD(formData.deadlineMechanic, "deadline mechanic")
          : null;
      const formattedDeadlineInstall =
        formData.statusInstall == 2
          ? formatDateToYYYYMMDD(formData.deadlineInstall, "deadline install")
          : null;
      const formattedDeadlineTestRun =
        formData.statusTestRun == 2
          ? formatDateToYYYYMMDD(formData.deadlineTestRun, "deadline testrun")
          : null;
      const formattedDeadlineSafetyCheck =
        formData.statusSafetyCheck == 2
          ? formatDateToYYYYMMDD(
              formData.deadlineSafetyCheck,
              "deadline safetycheck"
            )
          : null;
      const formattedProgrammerStartDate = formatDateToYYYYMMDD(
        formData.programmerStartDate,
        "programmer startdate"
      );
      const formattedProgrammerEndDate = formatDateToYYYYMMDD(
        formData.programmerEndDate,
        "programmer enddate"
      );
      const url = `http://192.168.1.150/editworkbom`;
      // ตรวจสอบว่า selectedSalesEngineer เป็น array หรือไม่
      const formattedStringSales = Array.isArray(formData.selectedSalesEngineer)
        ? `${formData.selectedSalesEngineer.join(",")}`
        : [];
      // ตรวจสอบว่า selectedDesignEngineer เป็น array หรือไม่
      const formattedStringDesign = Array.isArray(
        formData.selectedDesignEngineer
      )
        ? `${formData.selectedDesignEngineer.join(",")}`
        : [];
      // ตรวจสอบว่า selectedAutomation เป็น array หรือไม่
      const formattedStringAuto = Array.isArray(formData.selectedAutomation)
        ? `${formData.selectedAutomation.join(",")}`
        : [];
      // ตรวจสอบว่า selectedProgrammer เป็น array หรือไม่
      const formattedStringProgrammer = Array.isArray(
        formData.selectedProgrammer
      )
        ? `${formData.selectedProgrammer.join(",")}`
        : [];

      let projectData = {
        ...formData,
        id: projectId,
        workbomno: formData.workbomNo,
        workbomname: formData.projectName,
        ownerproject: formData.customer,
        project_detail: formData.projectDetail,
        sale_person_responsible: formattedStringSales,
        design_person_responsible: formattedStringDesign,
        auto_person_responsible: formattedStringAuto,
        programmer_person_responsible: formattedStringProgrammer,
        project_start: formattedProjectStart,
        project_end: formattedProjectEnd,
        sale_startdate: formattedSalesStartDate, // ระบุวันเริ่มโปรเจคที่จะแสดงในรายการของ sales
        sale_enddate: formattedSalesEndDate, // ระบุวันจบโปรเจคที่จะแสดงในรายการของ sales
        design_startdate: formattedDesignStartDate, // ระบุวันเริ่มโปรเจคที่จะแสดงในรายการของ design
        design_enddate: formattedDesignEndDate, // ระบุวันจบโปรเจคที่จะแสดงในรายการของ design
        auto_startdate: formattedAutoStartDate, // ระบุวันเริ่มโปรเจคที่จะแสดงในรายการของ auto
        auto_enddate: formattedAutoEndDate, // ระบุวันจบโปรเจคที่จะแสดงในรายการของ auto
        programmer_startdate: formattedProgrammerStartDate, // ระบุวันจบโปรเจคที่จะแสดงในรายการของ programmer
        programmer_enddate: formattedProgrammerEndDate, // ระบุวันจบโปรเจคที่จะแสดงในรายการของ programmer
        //Department
        dp_sales: formData.checkedSales,
        dp_design: formData.checkedDesign,
        dp_purchase: formData.checkedPurchase,
        dp_automation: formData.checkedAutomation,
        dp_programmer: formData.checkedProgrammer,
        dp_developer: 0,
        dp_planning: 0,
        //Sales
        sale_concept_status: formData.statusConceptSales,
        po_status: formData.statusPO,
        delivery_status: formData.statusDelivery,
        invoice_status: formData.statusINV,
        addition_status: formData.statusADD,
        sale_concept_deadline: formattedDeadlineConceptSales
          ? formattedDeadlineConceptSales
          : null,
        po_deadline: formattedDeadlinePO ? formattedDeadlinePO : null,
        delivery_deadline: formattedDeadlineDelivery
          ? formattedDeadlineDelivery
          : null,
        invoice_deadline: formattedDeadlineINV ? formattedDeadlineINV : null,
        addition_deadline: formattedDeadlineADD ? formattedDeadlineADD : null,
        //design
        concept_status: formData.statusConceptDesign,
        status_3d: formData.status3D,
        status_2d: formData.status2D,
        pr_status: formData.statusPR,
        concept_deadline: formattedDeadlineConceptDesign
          ? formattedDeadlineConceptDesign
          : null,
        deadline_3d: formattedDeadline3D ? formattedDeadline3D : null,
        deadline_2d: formattedDeadline2D ? formattedDeadline2D : null,
        pr_deadline: formattedDeadlinePR ? formattedDeadlinePR : null,
        //automation
        electrical_status: formData.statusElectrical,
        mechanic_status: formData.statusMechanic,
        program_status: formData.statusInstall,
        safetycheck_status: formData.statusSafetyCheck,
        testrun_status: formData.statusTestRun,
        electrical_deadline: formattedDeadlineElectrical
          ? formattedDeadlineElectrical
          : null,
        mechanic_deadline: formattedDeadlineMechanic
          ? formattedDeadlineMechanic
          : null,
        program_deadline: formattedDeadlineInstall
          ? formattedDeadlineInstall
          : null,
        testrun_deadline: formattedDeadlineTestRun
          ? formattedDeadlineTestRun
          : null,
        safetycheck_deadline: formattedDeadlineSafetyCheck
          ? formattedDeadlineSafetyCheck
          : null,
        // Programmer
        programmer_concept_deadline: formattedProgrammerEndDate,
        programmer_backup_deadline: formattedProgrammerEndDate,
        programmer_programs_deadline: formattedProgrammerEndDate,
        programmer_manual_deadline: formattedProgrammerEndDate,
        programmer_savefile_deadline: formattedProgrammerEndDate,
      };
      // ตรวจสอบข้อมูลก่อนส่ง
      console.log("📦 Sending Data to API:", projectData);
      // console.log(" dataAuto.person_user",  dataAuto.person_user)
      // console.log("Workbom No: ", projectData.workbomno);
      // console.log("Workbom Name: ", projectData.workbomname);
      // console.log("ownerproject: ", projectData.ownerproject);
      // console.log("selectedAutomation", projectData.auto_person_responsible);
      // console.log("project_detail: ", projectData.project_detail);
      // console.log("project_start: ", projectData.project_start);
      // console.log("project_end: ", projectData.project_end);
      // console.log("auto_start: ", projectData.auto_startdate);
      // console.log("auto_end: ", projectData.auto_enddate);
      // console.log("dp_design: ", projectData.dp_design);
      // console.log("dp_purchase: ", projectData.dp_purchase);
      // console.log("Dp_install: ", projectData.dp_programmer);
      // console.log("Dp_developer: ", projectData.dp_developer);
      // console.log("Dp_planning", projectData.dp_planning);
      // console.log("Dp_sales: ", projectData.dp_sales);
      // console.log("Dp_automation", projectData.dp_automation);
      // console.log("Status Electrical: ", projectData.electrical_status);
      // console.log("Status Mechanic: ", projectData.mechanic_status);
      // console.log("Status Install: ", projectData.program_status);
      // console.log("Status Safety Check: ", projectData.safetycheck_status);
      // console.log("Status Test Run: ", projectData.testrun_status);
      // console.log("Deadline Electrical: ", projectData.electrical_deadline);
      // console.log("Deadline Mechanic: ", projectData.mechanic_deadline);
      // console.log("Deadline Install", projectData.program_deadline);
      // console.log("Deadline SafetyCheck: ", projectData.safetycheck_deadline);
      // console.log("Deadline TestRun: ", projectData.testrun_deadline);
      // console.log("Concept Design: ", projectData.concept_status);
      // console.log("3D: ", projectData.status_3d);
      // console.log("2D: ", projectData.status_2d);
      // console.log("PR: ", projectData.pr_status);
      // console.log("Deadline Concept Design: ", projectData.concept_deadline);
      // console.log("Deadline 3D: ", projectData.deadline_3d);
      // console.log("Deadline 2D ", projectData.deadline_2d);
      // console.log("Deadline PR: ", projectData.pr_deadline);

      // ลบฟิลด์ที่มีค่าเป็น null หรือ undefined
      projectData = Object.fromEntries(
        Object.entries(projectData).filter(([_, v]) => v != null)
      );
      const result = await axios.post(url, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "8e8b2d7cef7899c87744427876ff8f15",
        },
      });
      // แสดง Alert Loading
      Swal.fire({
        title: "กำลังแก้ไขข้อมูล",
        text: "กรุณารอสักครู่...",
        timer: 1000,
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => Swal.showLoading(),
      });

      if (result.data.status === 200) {
        Swal.fire({
          title: "แก้ไขสำเร็จ !",
          text: "โปรเจคของคุณได้ถูกแก้ไข",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/planning/manageproject");
          }
        });
      } else {
        Swal.fire({
          title: "แก้ไขไม่สำเร็จ !",
          text: result.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to edit project. Please try again.");
    }
  };

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
    //console.log(result);
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

  // ฟังก์ชันจัดการการลบตัวเลือก
  const handleRemoveOptionAutomation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedAutomation: prevData.selectedAutomation.filter(
        (item, i) => i !== index
      ),
    }));
  };

  // ฟังก์ชันที่ทำให้ input ปรากฏเมื่อคลิก
  const handleInputClickAutomation = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showInputAutomation: true, // แสดง input เมื่อคลิก
      isTypingAutomation: true, // เริ่มให้พิมพ์ได้
    }));
  };

  // ฟังก์ชันกรองตัวเลือกตามคำค้นหา (ตรวจสอบว่าชื่อมีค่าก่อนเรียก toLowerCase)
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

  const getProgrammerList = async () => {
    const url = `http://192.168.1.150/viewlistuser?department=Program`;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "86fcdcba83e6b8bf98c2ac5dbf472fda",
      },
    });
    setFormData((prevFormData) => ({
      ...prevFormData, // คัดลอกค่าทั้งหมดจาก formData เดิม
      programmerList: result.data.data, // อัปเดตแค่ userList
    }));
    //console.log(result);
  };

  const handleSelectChangeProgrammer = (option, e) => {
    e.preventDefault();
    // ตรวจสอบว่า user ที่เลือกมีอยู่ใน selectedUser แล้วหรือยัง
    if (
      !formData.selectedProgrammer.some(
        (selected) =>
          selected.username == option.username ||
          selected.lastname == option.lastname
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        selectedProgrammer: [...prevData.selectedProgrammer, option.username], // เพิ่มตัวเลือกใหม่ในรายการที่เลือก
        searchProgrammer: "", // ล้างข้อความค้นหาหลังจากเลือก
        highlightedIndexProgrammer: -1, // รีเซ็ตตำแหน่งตัวเลือกที่ถูกเลือก
        isTypingProgrammer: false, // ให้ยังคงอยู่ในโหมดพิมพ์หลังจากเลือกคน
        showInputProgrammer: false, // ซ่อน input หลังจากเลือกคนแล้ว
      }));
    }
  };

  const handleSearchChangeProgrammer = (e) => {
    // อัปเดตค่าใน formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      searchProgrammer: e.target.value, // อัปเดตค่า search
      isTypingProgrammer: true, // ระบุว่ากำลังพิมพ์
      highlightedIndexProgrammer: -1, // รีเซ็ตตำแหน่งที่เลือก
    }));
  };

  // ฟังก์ชันกด Enter หรือปุ่มลูกศร
  const handleKeyDownProgrammer = (e) => {
    if (e.key == "ArrowDown") {
      // เลื่อนลงใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexProgrammer: Math.min(
          prevFormData.highlightedIndexProgrammer + 1,
          filteredOptionsProgrammer.length - 1
        ),
      }));
    } else if (e.key == "ArrowUp") {
      // เลื่อนขึ้นใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexProgrammer: Math.max(
          prevFormData.highlightedIndexProgrammer - 1,
          0
        ),
      }));
    } else if (e.key == "Enter") {
      e.preventDefault();
      if (
        formData.highlightedIndexProgrammer >= 0 &&
        formData.highlightedIndexProgrammer < filteredOptionsProgrammer.length
      ) {
        handleSelectChangeProgrammer(
          filteredOptionsProgrammer[formData.highlightedIndexProgrammer],
          e
        ); // เลือกตัวเลือกที่กำลังถูกเลือก
      } else if (formData.searchProgrammer.trim()) {
        // ถ้าไม่มีการเลือกใน dropdown และพิมพ์ชื่อที่ไม่อยู่ใน data จะไม่เพิ่มอะไร
        const search = formData.searchProgrammer.trim().toLowerCase(); // คำค้นหา
        const existingOption = formData.programmerList.find((option) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${option.username || ""} ${
            option.lastname || ""
          }`.toLowerCase();
          return fullName.includes(search); // เปรียบเทียบกับคำค้นหา
        });
        if (existingOption) {
          handleSelectChangeProgrammer(existingOption, e); // ถ้ามีชื่ออยู่ในรายการแล้ว
        }
      }
    }
  };

  // ฟังก์ชันจัดการการลบตัวเลือก
  const handleRemoveOptionProgrammer = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedProgrammer: prevData.selectedProgrammer.filter(
        (item, i) => i !== index
      ),
    }));
  };

  // ฟังก์ชันที่ทำให้ input ปรากฏเมื่อคลิก
  const handleInputClickProgrammer = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showInputProgrammer: true, // แสดง input เมื่อคลิก
      isTypingProgrammer: true, // เริ่มให้พิมพ์ได้
    }));
  };

  // ฟังก์ชันกรองตัวเลือกตามคำค้นหา (ตรวจสอบว่าชื่อมีค่าก่อนเรียก toLowerCase)
  const filteredOptionsProgrammer =
    formData.programmerList.length > 0
      ? formData.programmerList.filter((user) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${user.username} ${user.lastname}`.toLowerCase();
          // เปรียบเทียบ fullName กับคำค้นหา
          const search = formData.searchProgrammer
            ? formData.searchProgrammer.toLowerCase()
            : "";
          // เปรียบเทียบกับคำค้นหา
          return fullName.includes(search);
        })
      : [];

  useEffect(() => {
    getProgrammerList();
  }, []);

  const getSalesEngineerList = async () => {
    const url = `http://192.168.1.150/viewlistuser?department=Sales`;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "86fcdcba83e6b8bf98c2ac5dbf472fda",
      },
    });
    setFormData((prevFormData) => ({
      ...prevFormData, // คัดลอกค่าทั้งหมดจาก formData เดิม
      salesEngineerList: result.data.data, // อัปเดตแค่ userList
    }));
  };

  // ฟังก์ชันจัดการการเลือกตัวเลือก
  const handleSelectChangeSales = (option, e) => {
    e.preventDefault();
    // ตรวจสอบว่า user ที่เลือกมีอยู่ใน selectedUser แล้วหรือยัง
    if (
      !formData.selectedSalesEngineer.some(
        (selected) =>
          selected.username == option.username ||
          selected.lastname == option.lastname
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        selectedSalesEngineer: [
          ...prevData.selectedSalesEngineer,
          option.username,
        ], // เพิ่มตัวเลือกใหม่ในรายการที่เลือก
        searchSalesEngineer: "", // ล้างข้อความค้นหาหลังจากเลือก
        highlightedIndexSales: -1, // รีเซ็ตตำแหน่งตัวเลือกที่ถูกเลือก
        isTypingSalesEngineer: false, // ให้ยังคงอยู่ในโหมดพิมพ์หลังจากเลือกคน
        showInputSalesEngineer: false, // ซ่อน input หลังจากเลือกคนแล้ว
      }));
    }
  };

  // ฟังก์ชันจัดการการพิมพ์ค้นหา
  const handleSearchChangeSales = (e) => {
    // อัปเดตค่าใน formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      searchSalesEngineer: e.target.value, // อัปเดตค่า search
      isTypingSalesEngineer: true, // ระบุว่ากำลังพิมพ์
      highlightedIndexSales: -1, // รีเซ็ตตำแหน่งที่เลือก
    }));
  };

  // ฟังก์ชันกด Enter หรือปุ่มลูกศร
  const handleKeyDownSales = (e) => {
    if (e.key == "ArrowDown") {
      // เลื่อนลงใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexSales: Math.min(
          prevFormData.highlightedIndexSales + 1,
          filteredOptionsSales.length - 1
        ),
      }));
    } else if (e.key == "ArrowUp") {
      // เลื่อนขึ้นใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexSales: Math.max(
          prevFormData.highlightedIndexSales - 1,
          0
        ),
      }));
    } else if (e.key == "Enter") {
      e.preventDefault();
      if (
        formData.highlightedIndexSales >= 0 &&
        formData.highlightedIndexSales < filteredOptionsSales.length
      ) {
        handleSelectChangeSales(
          filteredOptionsSales[formData.highlightedIndexSales],
          e
        ); // เลือกตัวเลือกที่กำลังถูกเลือก
      } else if (formData.searchSalesEngineer.trim()) {
        // ถ้าไม่มีการเลือกใน dropdown และพิมพ์ชื่อที่ไม่อยู่ใน data จะไม่เพิ่มอะไร
        const search = formData.searchSalesEngineer.trim().toLowerCase(); // คำค้นหา
        const existingOption = formData.salesEngineerList.find((option) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${option.username || ""} ${
            option.lastname || ""
          }`.toLowerCase();
          return fullName.includes(search); // เปรียบเทียบกับคำค้นหา
        });
        if (existingOption) {
          handleSelectChangeSales(existingOption, e); // ถ้ามีชื่ออยู่ในรายการแล้ว
        }
      }
    }
  };

  // ฟังก์ชันจัดการการลบตัวเลือก
  const handleRemoveOptionSales = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedSalesEngineer: prevData.selectedSalesEngineer.filter(
        (item, i) => i !== index
      ),
    }));
  };

  // ฟังก์ชันที่ทำให้ input ปรากฏเมื่อคลิก
  const handleInputClickSales = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showInputSalesEngineer: true, // แสดง input เมื่อคลิก
      isTypingSalesEngineer: true, // เริ่มให้พิมพ์ได้
    }));
  };

  // ฟังก์ชันกรองตัวเลือกตามคำค้นหา (ตรวจสอบว่าชื่อมีค่าก่อนเรียก toLowerCase)
  const filteredOptionsSales =
    formData.salesEngineerList?.length > 0
      ? formData.salesEngineerList.filter((user) => {
          const fullName = `${user.username ?? ""} ${
            user.lastname ?? ""
          }`.toLowerCase();
          const search = formData.searchSalesEngineer?.toLowerCase() ?? "";
          return fullName.includes(search);
        })
      : [];

  useEffect(() => {
    getSalesEngineerList();
  }, []);

  const handleDeadlineConceptSalesChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineConceptSales: selectedDate, // อัพเดทเฉพาะ deadlineConceptSales
    }));
  };

  const handleDeadlineADDChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineADD: selectedDate, // อัพเดทเฉพาะ deadlineADD
    }));
  };

  const handleDeadlineConceptDesignChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineConceptDesign: selectedDate, // อัพเดทเฉพาะ deadlineConceptDesign
    }));
  };

  const handleDeadline3DChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadline3D: selectedDate, // อัพเดทเฉพาะ deadline3D
    }));
  };

  const handleDeadline2DChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadline2D: selectedDate, // อัพเดทเฉพาะ deadline2D
    }));
  };

  const handleDeadlinePRChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlinePR: selectedDate, // อัพเดทเฉพาะ deadlinePR
    }));
  };

  const handleDeadlineElectricalChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineElectrical: selectedDate, // อัพเดทเฉพาะ deadlineConcept
    }));
  };

  const handleDeadlineMechanicChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineMechanic: selectedDate, // อัพเดทเฉพาะ deadlineMechanic
    }));
  };

  const handleDeadlineInstallChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineInstall: selectedDate, // อัพเดทเฉพาะ deadline2D
    }));
  };

  const handleDeadlineSafetyCheckChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineSafetyCheck: selectedDate, // อัพเดทเฉพาะ deadlinePR
    }));
  };

  const handleDeadlineTestRunChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineTestRun: selectedDate, // อัพเดทเฉพาะ deadlinePR
    }));
  };

  const handleDeadlineConceptChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineElectrical: selectedDate, // อัพเดทเฉพาะ deadlineConcept
    }));
  };

  const handleDeadlineBackupChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineMechanic: selectedDate, // อัพเดทเฉพาะ deadlineMechanic
    }));
  };

  const handleDeadlineProgramChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineInstall: selectedDate, // อัพเดทเฉพาะ deadline2D
    }));
  };

  const handleDeadlineManaulChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineSafetyCheck: selectedDate, // อัพเดทเฉพาะ deadlinePR
    }));
  };

  const handleDeadlineSaveFileChange = (selectedDate) => {
    setFormData((prevData) => ({
      ...prevData, // เก็บค่าที่เหลืออยู่ใน formData
      deadlineTestRun: selectedDate, // อัพเดทเฉพาะ deadlinePR
    }));
  };

  const handleEditProject = (event) => {
    event.preventDefault();

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
        });
      }
    };

    // Validation checks
    if (!formData.workbomNo) {
      focusAndScrollTo(workbomNoRef, "กรุณากรอก Workbom No.!");
      return;
    }

    if (!formData.projectName) {
      focusAndScrollTo(projectNameRef, "กรุณากรอก Project Name!");
      return;
    }

    if (!formData.customer) {
      focusAndScrollTo(customerRef, "กรุณากรอกชื่อ Customer!");
      return;
    }

    if (!formData.projectStart) {
      focusAndScrollTo(
        projectStartRef,
        "กรุณาเลือก Project Start (All Project)!"
      );
      return;
    }

    if (!formData.projectEnd) {
      focusAndScrollTo(projectEndRef, "กรุณาเลือก Project End (All Project)!");
      return;
    }

    if (!formData.projectDetail) {
      focusAndScrollTo(projectDetailRef, "กรุณากรอก Project Detail!");
      return;
    }
    // Additional validations for sales, design and automation departments
    if (
      formData.checkedSales == 0 &&
      formData.checkedDesign == 0 &&
      formData.checkedAutomation == 0 &&
      formData.checkedProgrammer == 0
    ) {
      focusAndScrollTo(salesDepartmentRef, "กรุณาเลือก Department!");
      return; // หยุดการทำงานหากไม่มีแผนกใดถูกเลือก
    } else if (
      formData.checkedSales == 1 &&
      !formData.selectedSalesEngineer.length
    ) {
      // ตรวจสอบว่า Sales ถูกเลือกหรือยัง
      focusAndScrollTo(salesEngineerRef, "กรุณาเลือกชื่อ Sales!");
      return; // หยุดการทำงานหากไม่ได้เลือก Sales
    } else if (formData.checkedSales == 1 && !formData.salesStartDate) {
      focusAndScrollTo(salesStartDateRef, "กรุณาเลือก Project Start (Sales)!");
      return;
    } else if (formData.checkedSales == 1 && !formData.salesEndDate) {
      focusAndScrollTo(salesEndDateRef, "กรุณาเลือก Project End (Sales)!");
      return;
    } else if (
      formData.checkedSales == 1 &&
      !formData.selectedSalesEngineer.length
    ) {
      // ตรวจสอบว่า Sales ถูกเลือกหรือยัง
      focusAndScrollTo(salesEngineerRef, "กรุณาเลือกชื่อ Sales!");
      return; // หยุดการทำงานหากไม่ได้เลือก Sales
    } else if (
      formData.checkedDesign == 1 &&
      !formData.selectedDesignEngineer.length
    ) {
      // ตรวจสอบว่า Design ถูกเลือกหรือยัง
      focusAndScrollTo(designEngineerRef, "กรุณาเลือกชื่อ Design!");
      return; // หยุดการทำงานหากไม่ได้เลือก Design
    } else if (formData.checkedDesign == 1 && !formData.designStartDate) {
      focusAndScrollTo(
        designStartDateRef,
        "กรุณาเลือก Project Start (Design)!"
      );
      return;
    } else if (formData.checkedDesign == 1 && !formData.designEndDate) {
      focusAndScrollTo(designEndDateRef, "กรุณาเลือก Project End (Design)!");
      return;
    } else if (
      formData.checkedAutomation == 1 &&
      !formData.selectedAutomation.length
    ) {
      // ตรวจสอบว่า Automation ถูกเลือกหรือยัง
      focusAndScrollTo(automationRef, "กรุณาเลือกชื่อ Automation!");
      return; // หยุดการทำงานหากไม่ได้เลือก Automation
    } else if (formData.checkedAutomation == 1 && !formData.autoStartDate) {
      focusAndScrollTo(
        autoStartDateRef,
        "กรุณาเลือก Project Start (Automation)!"
      );
      return;
    } else if (formData.checkedAutomation == 1 && !formData.autoEndDate) {
      focusAndScrollTo(autoEndDateRef, "กรุณาเลือก Project End (Automation)!");
      return;
    } else if (
      formData.checkedProgrammer == 1 &&
      !formData.selectedProgrammer.length
    ) {
      // ตรวจสอบว่า Programmer ถูกเลือกหรือยัง
      focusAndScrollTo(programmerRef, "กรุณาเลือกชื่อ Programmer!");
      return; // หยุดการทำงานหากไม่ได้เลือก Programmer
    } else if (
      formData.checkedProgrammer == 1 &&
      !formData.programmerStartDate
    ) {
      focusAndScrollTo(
        programmerStartDateRef,
        "กรุณาเลือก Project Start (Programmer)!"
      );
      return;
    } else if (formData.checkedProgrammer == 1 && !formData.programmerEndDate) {
      focusAndScrollTo(
        programmerEndDateRef,
        "กรุณาเลือก Project End (Programmer)!"
      );
      return;
    }
    Swal.fire({
      title: "Edit Project",
      text: "ยืนยันการแก้ไขโปรเจค?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1AACAC",
      cancelButtonColor: "#E2DAD6",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        editProject();
      }
    });
  };

  const getDesignEngineerList = async () => {
    const url = `http://192.168.1.150/viewlistuser?department=Design`;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "86fcdcba83e6b8bf98c2ac5dbf472fda",
      },
    });
    setFormData((prevFormData) => ({
      ...prevFormData, // คัดลอกค่าทั้งหมดจาก formData เดิม
      designEngineerList: result.data.data, // อัปเดตแค่ userList
    }));
  };

  // ฟังก์ชันจัดการการเลือกตัวเลือก
  const handleSelectChangeDesign = (option, e) => {
    e.preventDefault();
    // ตรวจสอบว่า user ที่เลือกมีอยู่ใน selectedUser แล้วหรือยัง
    if (
      !formData.selectedDesignEngineer.some(
        (selected) =>
          selected.username == option.username ||
          selected.lastname == option.lastname
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        selectedDesignEngineer: [
          ...prevData.selectedDesignEngineer,
          option.username,
        ], // เพิ่มตัวเลือกใหม่ในรายการที่เลือก
        searchDesignEngineer: "", // ล้างข้อความค้นหาหลังจากเลือก
        highlightedIndexDesign: -1, // รีเซ็ตตำแหน่งตัวเลือกที่ถูกเลือก
        isTypingDesignEngineer: false, // ให้ยังคงอยู่ในโหมดพิมพ์หลังจากเลือกคน
        showInputDesignEngineer: false, // ซ่อน input หลังจากเลือกคนแล้ว
      }));
    }
  };
  // ฟังก์ชันจัดการการพิมพ์ค้นหา
  const handleSearchChangeDesign = (e) => {
    // อัปเดตค่าใน formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      searchDesignEngineer: e.target.value, // อัปเดตค่า search
      isTypingDesignEngineer: true, // ระบุว่ากำลังพิมพ์
      highlightedIndexDesign: -1, // รีเซ็ตตำแหน่งที่เลือก
    }));
  };
  // ฟังก์ชันกด Enter หรือปุ่มลูกศร
  const handleKeyDownDesign = (e) => {
    if (e.key == "ArrowDown") {
      // เลื่อนลงใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexDesign: Math.min(
          prevFormData.highlightedIndexDesign + 1,
          filteredOptionsDesign.length - 1
        ),
      }));
    } else if (e.key == "ArrowUp") {
      // เลื่อนขึ้นใน dropdown
      setFormData((prevFormData) => ({
        ...prevFormData,
        highlightedIndexDesign: Math.max(
          prevFormData.highlightedIndexDesign - 1,
          0
        ),
      }));
    } else if (e.key == "Enter") {
      e.preventDefault();
      if (
        formData.highlightedIndexDesign >= 0 &&
        formData.highlightedIndexDesign < filteredOptionsDesign.length
      ) {
        handleSelectChangeDesign(
          filteredOptionsDesign[formData.highlightedIndexDesign],
          e
        ); // เลือกตัวเลือกที่กำลังถูกเลือก
      } else if (formData.searchDesignEngineer.trim()) {
        // ถ้าไม่มีการเลือกใน dropdown และพิมพ์ชื่อที่ไม่อยู่ใน data จะไม่เพิ่มอะไร
        const search = formData.searchDesignEngineer.trim().toLowerCase(); // คำค้นหา
        const existingOption = formData.designEngineerList.find((option) => {
          // รวม username และ lastname เป็นสตริงเดียว
          const fullName = `${option.username || ""} ${
            option.lastname || ""
          }`.toLowerCase();
          return fullName.includes(search); // เปรียบเทียบกับคำค้นหา
        });
        if (existingOption) {
          handleSelectChangeDesign(existingOption, e); // ถ้ามีชื่ออยู่ในรายการแล้ว
        }
      }
    }
  };

  // ฟังก์ชันจัดการการลบตัวเลือก
  const handleRemoveOptionDesign = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDesignEngineer: prevData.selectedDesignEngineer.filter(
        (item, i) => i !== index
      ),
    }));
  };

  // ฟังก์ชันที่ทำให้ input ปรากฏเมื่อคลิก
  const handleInputClickDesign = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      showInputDesignEngineer: true, // แสดง input เมื่อคลิก
      isTypingDesignEngineer: true, // เริ่มให้พิมพ์ได้
    }));
  };

  // ฟังก์ชันกรองตัวเลือกตามคำค้นหา (ตรวจสอบว่าชื่อมีค่าก่อนเรียก toLowerCase)
  const filteredOptionsDesign =
    formData.designEngineerList?.length > 0
      ? formData.designEngineerList.filter((user) => {
          const fullName = `${user.username ?? ""} ${
            user.lastname ?? ""
          }`.toLowerCase();
          const search = formData.searchDesignEngineer?.toLowerCase() ?? "";
          return fullName.includes(search);
        })
      : [];

  useEffect(() => {
    if (formData.projectStart && formData.projectEnd) {
      // ทำงานเฉพาะเมื่อมีการเลือกทั้ง projectStart และ projectEnd
      // Sales
      if (formData.checkedSales == 1) {
        if (formData.salesStartDate) {
          setFormData((prevData) => ({
            ...prevData,
            salesStartDate: formData.projectStart,
          }));
        }
        if (formData.salesEndDate) {
          setFormData((prevData) => ({
            ...prevData,
            salesEndDate: formData.projectEnd,
          }));
        }
      }
      if (formData.salesStartDate && formData.salesEndDate) {
        // Deadline Concepts Sales
        if (formData.statusConceptSales == 2) {
          // Deadline Concept Sales
          if (
            formData.deadlineConceptSales &&
            formData.deadlineConceptSales < formData.salesStartDate
          ) {
            // ถ้า deadlineConceptSales น้อยกว่า salesStartDate ให้ตั้งเป็น salesStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineConceptSales: formData.salesStartDate, // อัพเดทเฉพาะ deadlineConceptSales
            }));
          } else if (
            formData.deadlineConceptSales &&
            formData.deadlineConceptSales > formData.salesEndDate
          ) {
            // ถ้า deadlineConceptSales มากกว่า salesEndDate ให้ตั้งเป็น salesEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineConceptSales: formData.salesEndDate, // อัพเดทเฉพาะ deadlineConceptSales
            }));
          }
        }
        // Deadline PO
        if (formData.statusPO == 2) {
          if (formData.deadlinePO) {
            if (formData.deadlinePO < formData.salesStartDate) {
              // ถ้า deadlinePO น้อยกว่า salesStartDate → ให้ตั้งเป็น salesStartDate
              setFormData((prevData) => ({
                ...prevData,
                deadlinePO: formData.salesStartDate,
              }));
            }
          }
        }
        // Deadline Invoice
        if (formData.statusINV == 2) {
          if (formData.deadlineINV) {
            if (formData.deadlineINV < formData.salesStartDate) {
              // ถ้า deadlineINV น้อยกว่า salesStartDate → ให้ตั้งเป็น salesStartDate
              setFormData((prevData) => ({
                ...prevData,
                deadlineINV: formData.salesStartDate,
              }));
            }
          }
        }
        // Deadline Addition
        if (formData.statusADD == 2) {
          if (
            formData.deadlineADD &&
            formData.deadlineADD < formData.salesStartDate
          ) {
            // ถ้า deadlineADD น้อยกว่า salesStartDate ให้ตั้งเป็น salesStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineADD: formData.salesStartDate, // อัพเดทเฉพาะ deadlineADD
            }));
          } else if (
            formData.deadlineADD &&
            formData.deadlineADD > formData.salesEndDate
          ) {
            // ถ้า deadlineADD มากกว่า salesEndDate ให้ตั้งเป็น salesEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineADD: formData.salesEndDate, // อัพเดทเฉพาะ deadlineADD
            }));
          }
        }
      }
      // Design
      if (formData.checkedDesign == 1) {
        if (
          formData.designStartDate &&
          (formData.designStartDate < formData.projectStart ||
            formData.designStartDate > formData.projectEnd)
        ) {
          // ถ้า designStartDate น้อยกว่า projectStart ให้ตั้งเป็น projectStart
          setFormData((prevData) => ({
            ...prevData, // เก็บข้อมูลเก่าทั้งหมด
            designStartDate: formData.projectStart, // อัพเดทเฉพาะ designStartDate
          }));
        } else if (
          formData.designEndDate &&
          (formData.designEndDate < formData.projectStart ||
            formData.designEndDate > formData.projectEnd)
        ) {
          // ถ้า designEndDate น้อยกว่า projectEnd ให้ตั้งเป็น projectEnd
          setFormData((prevData) => ({
            ...prevData, // เก็บข้อมูลเก่าทั้งหมด
            designEndDate: formData.projectEnd, // อัพเดทเฉพาะ designEndDate
          }));
        }
      }
      if (formData.designStartDate && formData.designEndDate) {
        // Deadline Concept Design
        if (formData.statusConceptDesign == 2) {
          if (
            formData.deadlineConceptDesign &&
            formData.deadlineConceptDesign < formData.designStartDate
          ) {
            // ถ้า deadlineConceptDesign น้อยกว่า designStartDate ให้ตั้งเป็น designStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineConceptDesign: formData.designStartDate, // อัพเดทเฉพาะ deadlineConceptDesign
            }));
          } else if (
            formData.deadlineConceptDesign &&
            formData.deadlineConceptDesign > formData.designEndDate
          ) {
            // ถ้า deadlineConceptDesign มากกว่า designEndDate ให้ตั้งเป็น designEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineConceptDesign: formData.designEndDate, // อัพเดทเฉพาะ deadlineConceptDesign
            }));
          }
        }
        // Deadline 3D
        if (formData.status3D == 2) {
          if (
            formData.deadline3D &&
            formData.deadline3D < formData.designStartDate
          ) {
            // ถ้า deadline3D น้อยกว่า designStartDate ให้ตั้งเป็น designStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadline3D: formData.designStartDate, // อัพเดทเฉพาะ deadline3D
            }));
          } else if (
            formData.deadline3D &&
            formData.deadline3D > formData.designEndDate
          ) {
            // ถ้า deadline3D มากกว่า designEndDate ให้ตั้งเป็น designEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadline3D: formData.designEndDate, // อัพเดทเฉพาะ deadline3D
            }));
          }
        }
        // Deadline 2D
        if (formData.status2D == 2) {
          if (
            formData.deadline2D &&
            formData.deadline2D < formData.designStartDate
          ) {
            // ถ้า deadline2D น้อยกว่า designStartDate ให้ตั้งเป็น designStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadline2D: formData.designStartDate, // อัพเดทเฉพาะ deadline2D
            }));
          } else if (
            formData.deadline2D &&
            formData.deadline2D > formData.designEndDate
          ) {
            // ถ้า deadline2D มากกว่า designEndDate ให้ตั้งเป็น designEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadline2D: formData.designEndDate, // อัพเดทเฉพาะ deadline2D
            }));
          }
        }
        // Deadline PR
        if (formData.statusPR == 2) {
          if (
            formData.deadlinePR &&
            formData.deadlinePR < formData.designStartDate
          ) {
            // ถ้า deadlinePR น้อยกว่า designStartDate ให้ตั้งเป็น designStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlinePR: formData.designStartDate, // อัพเดทเฉพาะ deadlinePR
            }));
          } else if (
            formData.deadlinePR &&
            formData.deadlinePR > formData.designEndDate
          ) {
            // ถ้า deadlinePR มากกว่า designEndDate ให้ตั้งเป็น designEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlinePR: formData.designEndDate, // อัพเดทเฉพาะ deadlinePR
            }));
          }
        }
      }
      if (formData.checkedAutomation == 1) {
        if (
          formData.autoStartDate &&
          (formData.autoStartDate < formData.projectStart ||
            formData.autoStartDate > formData.projectEnd)
        ) {
          // ถ้า autoStartDate น้อยกว่า projectStart ให้ตั้งเป็น projectStart
          setFormData((prevData) => ({
            ...prevData, // เก็บข้อมูลเก่าทั้งหมด
            autoStartDate: formData.projectStart, // อัพเดทเฉพาะ autoStartDate
          }));
        } else if (
          formData.autoEndDate &&
          (formData.autoEndDate < formData.projectStart ||
            formData.autoEndDate > formData.projectEnd)
        ) {
          // ถ้า autoEndDate น้อยกว่า projectEnd ให้ตั้งเป็น projectEnd
          setFormData((prevData) => ({
            ...prevData, // เก็บข้อมูลเก่าทั้งหมด
            autoEndDate: formData.projectEnd, // อัพเดทเฉพาะ autoEndDate
          }));
        }
      }
      if (formData.autoStartDate && formData.autoEndDate) {
        // Deadline Electrical
        if (formData.statusElectrical == 2) {
          if (
            formData.deadlineElectrical &&
            formData.deadlineElectrical < formData.autoStartDate
          ) {
            // ถ้า deadlineElectrical น้อยกว่า autoStartDate ให้ตั้งเป็น autoStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineElectrical: formData.autoStartDate, // อัพเดทเฉพาะ deadlineElectrical
            }));
          } else if (
            formData.deadlineElectrical &&
            formData.deadlineElectrical > formData.autoEndDate
          ) {
            // ถ้า deadlineElectrical มากกว่า autoEndDate ให้ตั้งเป็น autoEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineElectrical: formData.autoEndDate, // อัพเดทเฉพาะ deadlineElectrical
            }));
          }
        }
        // Deadline Mechanic
        if (formData.statusMechanic == 2) {
          if (
            formData.deadlineMechanic &&
            formData.deadlineMechanic < formData.autoStartDate
          ) {
            // ถ้า deadlineMechanic น้อยกว่า autoStartDate ให้ตั้งเป็น autoStartDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineMechanic: formData.autoStartDate, // อัพเดทเฉพาะ deadlineMechanic
            }));
          } else if (
            formData.deadlineMechanic &&
            formData.deadlineMechanic > formData.autoEndDate
          ) {
            // ถ้า deadlineMechanic มากกว่า autoEndDate ให้ตั้งเป็น autoEndDate
            setFormData((prevData) => ({
              ...prevData, // เก็บข้อมูลเก่าทั้งหมด
              deadlineMechanic: formData.autoEndDate, // อัพเดทเฉพาะ deadlineMechanic
            }));
          }
        }
      }
    }
  }, [
    formData.deadlineConceptDesign,
    formData.deadline3D,
    formData.deadline2D,
    formData.deadlinePR,
    formData.deadlineConceptSales,
    formData.deadlinePO,
    formData.deadlineDelivery,
    formData.deadlineINV,
    formData.deadlineADD,
    formData.deadlineElectrical,
    formData.deadlineMechanic,
    formData.projectStart,
    formData.projectEnd,
    formData.salesStartDate,
    formData.salesEndDate,
    formData.designStartDate,
    formData.designEndDate,
    formData.autoStartDate,
    formData.autoEndDate,
  ]);
  useEffect(() => {
    if (formData.projectStart) {
      projectStartRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.projectStart เปลี่ยนแปลง
    }
  }, [formData.projectStart]);
  useEffect(() => {
    if (formData.projectEnd) {
      projectEndRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.projectEnd เปลี่ยนแปลง
    }
  }, [formData.projectEnd]);
  useEffect(() => {
    if (formData.salesStartDate) {
      salesStartDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.salesStartDate เปลี่ยนแปลง
    }
  }, [formData.salesStartDate]);
  useEffect(() => {
    if (formData.salesEndDate) {
      salesEndDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.salesEndDate เปลี่ยนแปลง
    }
  }, [formData.salesEndDate]);
  useEffect(() => {
    if (formData.designStartDate) {
      designStartDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.designStartDate เปลี่ยนแปลง
    }
  }, [formData.designStartDate]);
  useEffect(() => {
    if (formData.designEndDate) {
      designEndDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.designEndDate เปลี่ยนแปลง
    }
  }, [formData.designEndDate]);
  useEffect(() => {
    if (formData.autoStartDate) {
      autoStartDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.autoStartDate เปลี่ยนแปลง
    }
  }, [formData.autoStartDate]);
  useEffect(() => {
    if (formData.autoEndDate) {
      autoEndDateRef.current?.focus(); // สั่ง focus เมื่อมีการเปิดหรือ formData.autoEndDate เปลี่ยนแปลง
    }
  }, [formData.autoEndDate]);

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    if (session) {
      setFormData((prevFormData) => ({
        ...prevFormData, // คัดลอกค่าทั้งหมดจาก formData เดิม
        username: session, // อัปเดตแค่ username
      }));
    }
  }, []);

  useEffect(() => {
    getDesignEngineerList();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow mt-[-20px]">
          <div className="px-4 sm:px-6 lg:px-8 w-full max-w-10xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0"></div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6">
              {/* Card (Customers) */}
              <header class="px-5 py-4 border-b border-gray-100 rounded-t-lg flex flex-col gap-1 bg-white">
                <h3 className="text-base badge bg-[#FFB200]/60 text-black border-none flex flex-row gap-1">
                  <span className="font-semibold">Workbom No: </span>
                  {formData.workbomNo}
                </h3>
                <h1 class="font-bold text-gray-800 text-xl font-LexendDeca">
                  Edit Project
                </h1>
              </header>
            </div>
            <div
              class={`bg-white px-5 py-10 overflow-y-visible font-medium ${
                formData.checkedDesign == 1
                  ? "min-h-[calc(100vh-200px)]"
                  : "h-fit"
              }`}
            >
              <div class="relative w-sm px-20">
                <form
                  onSubmit={handleEditProject}
                  className="flex flex-col gap-10"
                >
                  {project ? (
                    <>
                      <div className="flex flex-row justify-between gap-5">
                        <div className="flex flex-col gap-1 w-full">
                          <label
                            htmlFor="workbom-no"
                            className="font-bold text-[#45474B]"
                          >
                            <span className="text-red-600 font-bold">*</span>
                            Workbom No.
                          </label>
                          <input
                            ref={workbomNoRef}
                            type="text"
                            placeholder="Type here.."
                            className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                            value={formData.workbomNo} // ป้องกัน undefined ด้วย `?? ""`
                            autoComplete="off"
                            onChange={(event) =>
                              setFormData((prevData) => ({
                                ...prevData,
                                workbomNo: event.target.value,
                              }))
                            }
                            id="workbom-no"
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label
                            htmlFor="project-name"
                            className="font-bold text-[#45474B]"
                          >
                            <span className="text-red-600 font-bold ">*</span>
                            Project Name
                          </label>
                          <input
                            ref={projectNameRef}
                            type="text"
                            placeholder="Type here.."
                            className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                            value={formData.projectName}
                            autoComplete="off"
                            onChange={(event) =>
                              setFormData((prevData) => ({
                                ...prevData,
                                projectName: event.target.value,
                              }))
                            }
                            id="project-name"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row justify-between gap-5">
                        <div className="flex flex-col gap-1 w-full">
                          <label
                            htmlFor="customer"
                            className="font-bold text-[#45474B]"
                          >
                            <span className="text-red-600 font-bold">*</span>
                            Customer
                          </label>
                          <input
                            ref={customerRef}
                            type="text"
                            placeholder="Type here.."
                            className="w-full h-full px-1 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                            id="customer"
                            value={formData.customer}
                            autoComplete="off"
                            onChange={(event) =>
                              setFormData((prevData) => ({
                                ...prevData,
                                customer: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex flex-row justify-between gap-5 w-full h-full">
                          <div className="flex flex-col gap-2 w-full h-full">
                            <label
                              htmlFor="projectstart"
                              className="font-bold text-[#45474B]"
                            >
                              <span className="text-red-600 font-bold">*</span>
                              Project Start (All Project)
                            </label>
                            <div className="relative">
                              <CalendarInput
                                id="projectstart"
                                date={formData.projectStart}
                                setDate={(selectedDate) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    projectStart: selectedDate,
                                  }))
                                }
                              />

                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-calendar3"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 w-full h-full">
                            <label
                              htmlFor="projectend"
                              className="font-bold text-[#45474B]"
                            >
                              <span className="text-red-600 font-bold">*</span>
                              Project End (All Project)
                            </label>
                            <div className="relative">
                              <CalendarInput
                                id="projectend"
                                date={formData.projectEnd}
                                setDate={(selectedDate) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    projectEnd: selectedDate,
                                  }))
                                }
                              />

                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-calendar3"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                  <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="project-detail"
                          className="font-bold text-[#45474B]"
                        >
                          <span className="text-red-600 font-bold">*</span>
                          Project Detail
                        </label>
                        <textarea
                          ref={projectDetailRef}
                          id="project-detail"
                          placeholder="Type here.."
                          className="w-full pl-1 pr-4 border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0 resize-none"
                          value={formData.projectDetail}
                          autoComplete="off"
                          onChange={(event) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              projectDetail: event.target.value,
                            }))
                          }
                        ></textarea>
                      </div>
                      {/* Department */}
                      <div className="flex flex-col gap-5">
                        <fieldset>
                          <legend className="font-bold text-gray-800">
                            <span className="text-red-600 font-bold">*</span>{" "}
                            Department
                          </legend>
                          <div className="flex flex-col gap-3">
                            {/* checkbox sales */}
                            <div className="flex items-center gap-2">
                              <input
                                ref={salesDepartmentRef}
                                id="department-sales"
                                type="checkbox"
                                checked={formData.checkedSales == 1}
                                onChange={(e) => {
                                  setFormData((prevForm) => ({
                                    ...prevForm,
                                    checkedSales: e.target.checked ? 1 : 0,
                                  }));
                                }}
                                disabled={
                                  !formData.projectStart || !formData.projectEnd
                                }
                                className="checkbox"
                              />
                              <label
                                className="w-full"
                                htmlFor="department-sales"
                              >
                                Sales
                              </label>
                            </div>
                          </div>
                        </fieldset>
                        {formData.checkedSales == 1 ? (
                          <>
                            <div className="flex flex-col gap-3 border-2 border-orange-300 p-3 rounded-md w-full h-fit overflow-visible">
                              <div>
                                <label
                                  htmlFor="sales"
                                  className="font-bold text-[#45474B]"
                                >
                                  <span className="text-red-600 font-bold">
                                    *
                                  </span>
                                  Sales
                                </label>
                                <div className="w-full h-full mx-auto">
                                  {/* Container for Selected Options and Input */}
                                  <div
                                    className="relative flex items-center p-2 gap-2 flex-wrap border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                                    style={{ minHeight: "50px" }}
                                    onClick={handleInputClickSales}
                                  >
                                    {/* Display "Select Staff" if no input or selectedUser */}
                                    {formData.selectedSalesEngineer.length ==
                                      0 &&
                                      !formData.searchSalesEngineer && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                          Select Staff
                                        </div>
                                      )}

                                    {/* Display Selected Chips inside the input */}
                                    {formData.selectedSalesEngineer.map(
                                      (option, index) => {
                                        //console.log("Option2:", option);
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center bg-[#F0EBCC] rounded-full py-1 pl-2 pr-1 text-black w-auto h-auto"
                                          >
                                            <span>{option}</span>
                                            <button
                                              className="ml-2 text-gray-500"
                                              onClick={() =>
                                                handleRemoveOptionSales(index)
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        );
                                      }
                                    )}

                                    {/* Input for searching and selecting options */}
                                    <input
                                      ref={salesEngineerRef}
                                      type="text"
                                      autoComplete="off"
                                      className="bg-white text-black border-b-2 border-t-0 border-l-0 border-r-0 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex-grow"
                                      onChange={handleSearchChangeSales}
                                      onKeyDown={handleKeyDownSales}
                                      value={formData.searchSalesEngineer}
                                      autoFocus
                                      style={{
                                        minWidth: "120px",
                                        border: "none",
                                        outline: "none",
                                      }}
                                      id="sales"
                                    />
                                  </div>

                                  {/* Dropdown for options */}
                                  {formData.searchSalesEngineer && (
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu p-2 shadow bg-white rounded-box w-full mt-2"
                                    >
                                      {filteredOptionsSales.length > 0 ? (
                                        filteredOptionsSales.map(
                                          (option, index) => {
                                            //console.log("Option:", option); // ✅ log ข้อมูลก่อน return
                                            return (
                                              <li
                                                key={index}
                                                onClick={(e) =>
                                                  handleSelectChangeSales(
                                                    option,
                                                    e
                                                  )
                                                }
                                                className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center ${
                                                  formData.highlightedIndexSales ===
                                                  index
                                                    ? "bg-gray-200"
                                                    : ""
                                                }`}
                                              >
                                                {option.username}{" "}
                                                {option.lastname}
                                              </li>
                                            );
                                          }
                                        )
                                      ) : (
                                        <li className="p-2">
                                          No results found
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row justify-between gap-5 w-full h-full">
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="sales-startdate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project Start (Sales)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={salesStartDateRef}
                                      date={formData.salesStartDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          salesStartDate: selectedDate,
                                        }))
                                      }
                                      id="sales-startdate"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="sales-enddate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project End (Sales)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={salesEndDateRef}
                                      date={formData.salesEndDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          salesEndDate: selectedDate,
                                        }))
                                      }
                                      id="sales-enddate"
                                    />

                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-around">
                                {/* Checkbox สำหรับเลือกสถานะ */}
                                <label className="font-bold text-gray-800">
                                  Status
                                </label>
                                <div className="flex flex-row justify-between">
                                  <div className="flex flex-row gap-4">
                                    {/* checkbox concept */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          formData.statusConceptSales == 2
                                        }
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusConceptSales: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineConceptSales: e.target
                                              .checked
                                              ? prevForm.deadlineConceptSales
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.salesStartDate &&
                                            !formData.salesEndDate) ||
                                            formData.statusConceptSales == 3 || 
                                          formData.statusSuccessSales == 3
                                        }
                                      />
                                      <span>Concept</span>
                                      {/* deadline concept */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineConceptSalesRef}
                                            date={
                                              formData.statusConceptSales != 1
                                                ? formData.deadlineConceptSales
                                                : null
                                            }
                                            setDate={
                                              handleDeadlineConceptSalesChange
                                            }
                                            disabled={
                                              (!formData.salesStartDate &&
                                                !formData.salesEndDate) ||
                                              formData.statusConceptSales == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* checkbox PO */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        id="status"
                                        type="checkbox"
                                        checked={formData.statusPO == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusPO: e.target.checked ? 2 : 1,
                                            deadlinePO: e.target.checked
                                              ? prevForm.deadlinePO
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.salesStartDate &&
                                            !formData.salesEndDate) ||
                                            formData.statusPO == 3 ||
                                          formData.statusSuccessSales == 3
                                        }
                                      />
                                      <span>PO</span>
                                      {/* deadline PO */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlinePORef}
                                            date={
                                              formData.statusPO != 1
                                                ? formData.deadlinePO
                                                : null
                                            }
                                            setDate={(selectedDate) =>
                                              setFormData((prevData) => ({
                                                ...prevData,
                                                deadlinePO: selectedDate,
                                              }))
                                            }
                                            disabled={
                                              (!formData.salesStartDate &&
                                                !formData.salesEndDate) ||
                                              formData.statusPO == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* checkbox Delivery */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.statusDelivery == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusDelivery: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineDelivery: e.target.checked
                                              ? prevForm.salesEndDate
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.salesStartDate &&
                                            !formData.salesEndDate) ||
                                            formData.statusDelivery == 3 || 
                                          formData.statusSuccessSales == 3
                                        }
                                      />
                                      <span>Delivery</span>
                                      {/* deadline Delivery */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineDeliveryRef}
                                            date={
                                              formData.statusDelivery != 1
                                                ? formData.deadlineDelivery
                                                : null
                                            }
                                            setDate={(selectedDate) =>
                                              setFormData((prevData) => ({
                                                ...prevData,
                                                deadlineDelivery: selectedDate,
                                              }))
                                            }
                                            disabled={
                                              (!formData.salesStartDate &&
                                                !formData.salesEndDate) ||
                                              formData.statusDelivery == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* checkbox Invoice */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        id="status"
                                        type="checkbox"
                                        checked={formData.statusINV == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusINV: e.target.checked ? 2 : 1,
                                            deadlineINV: e.target.checked
                                              ? prevForm.deadlineINV
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.salesStartDate &&
                                            !formData.salesEndDate) ||
                                            formData.statusINV == 3 ||
                                          formData.statusSuccessSales == 3
                                        }
                                      />
                                      <span>INV</span>
                                      {/* deadline Invoice */}
                                      <div className="flex flex-row gap-2">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineINVRef}
                                            date={
                                              formData.statusINV != 1
                                                ? formData.deadlineINV
                                                : null
                                            }
                                            setDate={(selectedDate) =>
                                              setFormData((prevData) => ({
                                                ...prevData,
                                                deadlineINV: selectedDate,
                                              }))
                                            }
                                            disabled={
                                              (!formData.salesStartDate &&
                                                !formData.salesEndDate) ||
                                              formData.statusINV == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      {/* checkbox Addition */}
                                      <div className="flex flex-row gap-1 items-center">
                                        <input
                                          id="status"
                                          type="checkbox"
                                          checked={formData.statusADD == 2}
                                          onChange={(e) => {
                                            setFormData((prevForm) => ({
                                              ...prevForm,
                                              statusADD: e.target.checked
                                                ? 2
                                                : 1,
                                              deadlineADD: e.target.checked
                                                ? prevForm.deadlineADD
                                                : null,
                                            }));
                                          }}
                                          className="checkbox"
                                          disabled={
                                            (!formData.salesStartDate &&
                                              !formData.salesEndDate) ||
                                              formData.statusADD == 3 ||
                                            formData.statusSuccessSales == 3
                                          }
                                        />
                                        <span>ADD</span>
                                        {/* deadline Addition */}
                                        <div className="flex flex-row gap-2 w-full">
                                          <div className="relative">
                                            <CalendarInput
                                              ref={deadlineADDRef}
                                              date={
                                                formData.statusADD != 1
                                                  ? formData.deadlineADD
                                                  : null
                                              }
                                              setDate={handleDeadlineADDChange}
                                              disabled={
                                                (!formData.salesStartDate &&
                                                  !formData.salesEndDate) ||
                                                formData.statusADD == 1
                                              }
                                            />
                                            {/* icon calendar */}
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-calendar3"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {/* checkbox Design */}
                        <div className="flex items-center gap-2">
                          <input
                            ref={designDepartmentRef}
                            id="design"
                            type="checkbox"
                            checked={formData.checkedDesign}
                            onChange={(e) => {
                              setFormData((prevForm) => ({
                                ...prevForm,
                                checkedDesign: e.target.checked ? 1 : 0,
                              }));
                            }}
                            disabled={
                              !formData.projectStart && !formData.projectEnd
                            }
                            className="checkbox"
                          />
                          <span className="w-full">Design</span>
                        </div>
                        {formData.checkedDesign == 1 ? (
                          <>
                            <div className="flex flex-col gap-3 border-2 border-orange-300 p-3 rounded-md w-full h-fit overflow-visible">
                              <div>
                                <label
                                  htmlFor="design-engineer"
                                  className="font-bold text-[#45474B]"
                                >
                                  <span className="text-red-600 font-bold">
                                    *
                                  </span>
                                  Design Engineer
                                </label>
                                <div className="w-full h-full mx-auto">
                                  {/* Container for Selected Options and Input */}
                                  <div
                                    className="relative flex items-center p-2 gap-2 flex-wrap border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                                    style={{ minHeight: "50px" }}
                                    onClick={handleInputClickDesign}
                                  >
                                    {/* Display "Select Staff" if no input or selectedUser */}
                                    {formData.selectedDesignEngineer.length ==
                                      0 &&
                                      !formData.searchDesignEngineer && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                          Select Staff
                                        </div>
                                      )}

                                    {/* Display Selected Chips inside the input */}
                                    {formData.selectedDesignEngineer.map(
                                      (option, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center bg-[#F0EBCC] rounded-full py-1 pl-2 pr-1 text-black w-auto h-auto"
                                        >
                                          <span>{option}</span>
                                          <button
                                            className="ml-2 text-gray-500"
                                            onClick={() =>
                                              handleRemoveOptionDesign(index)
                                            }
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      )
                                    )}
                                    {/* Input for searching and selecting options */}
                                    <input
                                      ref={designEngineerRef}
                                      type="text"
                                      autoComplete="off"
                                      className="bg-white text-black border-b-2 border-t-0 border-l-0 border-r-0 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex-grow"
                                      onChange={handleSearchChangeDesign}
                                      onKeyDown={handleKeyDownDesign}
                                      value={formData.searchDesignEngineer}
                                      autoFocus
                                      style={{
                                        minWidth: "120px",
                                        border: "none",
                                        outline: "none",
                                      }}
                                      id="design-engineer"
                                    />
                                  </div>

                                  {/* Dropdown for options */}
                                  {formData.searchDesignEngineer && (
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu p-2 shadow bg-white rounded-box w-full mt-2"
                                    >
                                      {filteredOptionsDesign.length > 0 ? (
                                        filteredOptionsDesign.map(
                                          (option, index) => (
                                            <li
                                              key={index}
                                              onClick={(e) =>
                                                handleSelectChangeDesign(
                                                  option,
                                                  e
                                                )
                                              }
                                              className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center ${
                                                formData.highlightedIndexDesign ==
                                                index
                                                  ? "bg-gray-200"
                                                  : ""
                                              }`}
                                            >
                                              {option.username}{" "}
                                              {option.lastname}
                                            </li>
                                          )
                                        )
                                      ) : (
                                        <li className="p-2">
                                          No results found
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row justify-between gap-5 w-full h-full">
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="design-startdate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project Start (Design)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={designStartDateRef}
                                      date={formData.designStartDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          designStartDate: selectedDate,
                                        }))
                                      }
                                      id="design-startdate"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="design-enddate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project End (Design)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={designEndDateRef}
                                      date={formData.designEndDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          designEndDate: selectedDate,
                                        }))
                                      }
                                      id="design-enddate"
                                    />

                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-around">
                                {/* Checkbox สำหรับเลือกสถานะ */}
                                <label
                                  htmlFor="status"
                                  className="font-bold text-gray-800"
                                >
                                  Status
                                </label>
                                <div className="flex flex-row justify-between">
                                  <div className="flex flex-row gap-4">
                                    {/* checkbox concept design */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          formData.statusConceptDesign == 2
                                        }
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusConceptDesign: e.target
                                              .checked
                                              ? 2
                                              : 1,
                                            deadlineConceptDesign: e.target
                                              .checked
                                              ? prevForm.deadlineConceptDesign
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.designStartDate &&
                                            !formData.designEndDate) ||
                                            formData.statusConceptDesign == 3 ||
                                          formData.statusSuccessDesign == 3
                                        }
                                      />
                                      <span>Concept</span>
                                    </div>
                                    {/* deadline concept design */}
                                    <div className="relative">
                                      <CalendarInput
                                        ref={deadlineConceptRef}
                                        date={
                                          formData.statusConceptDesign != 1
                                            ? formData.deadlineConceptDesign
                                            : null
                                        }
                                        setDate={
                                          handleDeadlineConceptDesignChange
                                        }
                                        disabled={
                                          (!formData.designStartDate &&
                                            !formData.designEndDate) ||
                                          formData.statusConceptDesign == 1
                                        }
                                      />
                                      {/* icon calendar */}
                                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-calendar3"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                          <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                        </svg>
                                      </div>
                                    </div>

                                    {/* checkbox 3D */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.status3D == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            status3D: e.target.checked ? 2 : 1,
                                            deadline3D: e.target.checked
                                              ? prevForm.deadline3D
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.designStartDate &&
                                            !formData.designEndDate) ||
                                            formData.status3D == 3 ||
                                          formData.statusSuccessDesign == 3
                                        }
                                      />
                                      <span>3D</span>
                                      {/* deadline 3D */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadline3DRef}
                                            date={
                                              formData.status3D != 1
                                                ? formData.deadline3D
                                                : null
                                            }
                                            setDate={handleDeadline3DChange}
                                            disabled={
                                              (!formData.designStartDate &&
                                                !formData.designEndDate) ||
                                              formData.status3D == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* checkbox 2D */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.status2D == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            status2D: e.target.checked ? 2 : 1,
                                            deadline2D: e.target.checked
                                              ? prevForm.deadline2D
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.designStartDate &&
                                            !formData.designEndDate) ||
                                            formData.status2D == 3 ||
                                          formData.statusSuccessDesign == 3
                                        }
                                      />
                                      <span>2D</span>
                                    </div>
                                    {/* deadline 2D */}
                                    <div className="flex flex-row gap-2">
                                      <div className="relative">
                                        <CalendarInput
                                          ref={deadline2DRef}
                                          date={
                                            formData.status2D != 1
                                              ? formData.deadline2D
                                              : null
                                          }
                                          setDate={handleDeadline2DChange}
                                          disabled={
                                            (!formData.designStartDate &&
                                              !formData.designEndDate) ||
                                            formData.status2D == 1
                                          }
                                        />
                                        {/* icon calendar */}
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-calendar3"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    {/* checkbox PR */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.statusPR == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusPR: e.target.checked ? 2 : 1,
                                            deadlinePR: e.target.checked
                                              ? prevForm.deadlinePR
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.designStartDate &&
                                            !formData.designEndDate) ||
                                            formData.statusPR == 3 ||
                                          formData.statusSuccessDesign == 3
                                        }
                                      />
                                      <span>PR</span>
                                    </div>
                                    {/* deadline PR */}
                                    <div className="flex flex-row gap-2">
                                      <div className="relative">
                                        <CalendarInput
                                          ref={deadlinePRRef}
                                          date={
                                            formData.statusPR != 1
                                              ? formData.deadlinePR
                                              : null
                                          }
                                          setDate={handleDeadlinePRChange}
                                          disabled={
                                            (!formData.designStartDate &&
                                              !formData.designEndDate) ||
                                            formData.statusPR == 1
                                          }
                                        />
                                        {/* icon calendar */}
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-calendar3"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                            <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {/* checkbox automation */}
                        <div className="flex items-center gap-2">
                          <input
                            ref={automationDepartmentRef}
                            id="department-auto"
                            type="checkbox"
                            checked={formData.checkedAutomation == 1}
                            onChange={(e) => {
                              setFormData((prevForm) => ({
                                ...prevForm,
                                checkedAutomation: e.target.checked ? 1 : 0,
                              }));
                            }}
                            disabled={
                              !formData.projectStart && !formData.projectEnd
                            }
                            className="checkbox"
                          />
                          <label className="w-full" htmlFor="department-auto">
                            Automation
                          </label>
                        </div>
                        {formData.checkedAutomation == 1 ? (
                          <>
                            <div className="flex flex-col gap-3 border-2 border-orange-300 p-3 rounded-md w-full h-fit overflow-visible">
                              <div>
                                <label
                                  htmlFor="automation"
                                  className="font-bold text-[#45474B]"
                                >
                                  <span className="text-red-600 font-bold">
                                    *
                                  </span>
                                  Automation
                                </label>
                                <div className="w-full h-full mx-auto">
                                  {/* Container for Selected Options and Input */}
                                  <div
                                    className="relative flex items-center p-2 gap-2 flex-wrap border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                                    style={{ minHeight: "50px" }}
                                    onClick={handleInputClickAutomation}
                                  >
                                    {/* Display "Select Staff" if no input or selectedUser */}
                                    {formData.selectedAutomation.length == 0 &&
                                      !formData.searchAutomation && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                          Select Staff
                                        </div>
                                      )}

                                    {/* Display Selected Chips inside the input */}
                                    {formData.selectedAutomation.map(
                                      (option, index) => {
                                        //console.log("Option2:", option);
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center bg-[#F0EBCC] rounded-full py-1 pl-2 pr-1 text-black w-auto h-auto"
                                          >
                                            <span>{option}</span>
                                            <button
                                              className="ml-2 text-gray-500"
                                              onClick={() =>
                                                handleRemoveOptionAutomation(
                                                  index
                                                )
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        );
                                      }
                                    )}

                                    {/* Input for searching and selecting options */}
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

                                  {/* Dropdown for options */}
                                  {formData.searchAutomation && (
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu p-2 shadow bg-white rounded-box w-full mt-2"
                                    >
                                      {filteredOptionsAutomation.length > 0 ? (
                                        filteredOptionsAutomation.map(
                                          (option, index) => {
                                            //console.log("Option:", option); // ✅ log ข้อมูลก่อน return
                                            return (
                                              <li
                                                key={index}
                                                onClick={(e) =>
                                                  handleSelectChangeAutomation(
                                                    option,
                                                    e
                                                  )
                                                }
                                                className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center ${
                                                  formData.highlightedIndexAutomation ===
                                                  index
                                                    ? "bg-gray-200"
                                                    : ""
                                                }`}
                                              >
                                                {option.username}{" "}
                                                {option.lastname}
                                              </li>
                                            );
                                          }
                                        )
                                      ) : (
                                        <li className="p-2">
                                          No results found
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row justify-between gap-5 w-full h-full">
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="auto-startdate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project Start (Automation)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={autoStartDateRef}
                                      date={formData.autoStartDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          autoStartDate: selectedDate,
                                        }))
                                      }
                                      id="auto-startdate"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="auto-enddate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project End (Automation)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={autoEndDateRef}
                                      date={formData.autoEndDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          autoEndDate: selectedDate,
                                        }))
                                      }
                                      id="auto-enddate"
                                    />

                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-around">
                                {/* Checkbox สำหรับเลือกสถานะ */}
                                <label className="font-bold text-gray-800">
                                  Status
                                </label>
                                <div className="flex flex-row justify-between">
                                  <div className="flex flex-row gap-4">
                                    {/* checkbox electrical */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.statusElectrical == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusElectrical: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineElectrical: e.target.checked
                                              ? prevForm.deadlineElectrical
                                              : null, // ล้างค่าเมื่อ checkbox ถูกติ๊กออก
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.autoStartDate &&
                                            !formData.autoEndDate) ||
                                            formData.statusElectrical == 3 ||
                                          formData.statusSuccessAuto == 3
                                        }
                                      />
                                      <span>Electrical</span>
                                      {/* deadline electrical */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineElectricalRef}
                                            date={
                                              formData.statusElectrical != 1
                                                ? formData.deadlineElectrical
                                                : null
                                            }
                                            setDate={
                                              handleDeadlineElectricalChange
                                            }
                                            disabled={
                                              (!formData.autoStartDate &&
                                                !formData.autoEndDate) ||
                                              formData.statusElectrical == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* checkbox mechanic */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        id="status"
                                        type="checkbox"
                                        checked={formData.statusMechanic == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusMechanic: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineMechanic: e.target.checked
                                              ? prevForm.deadlineMechanic
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.autoStartDate &&
                                            !formData.autoEndDate) ||
                                            formData.statusMechanic == 3 ||
                                          formData.statusSuccessAuto == 3
                                        }
                                      />
                                      <span>Mechanic</span>
                                      {/* deadline mechanic */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineMechanicRef}
                                            date={
                                              formData.statusMechanic != 1
                                                ? formData.deadlineMechanic
                                                : null
                                            }
                                            setDate={
                                              handleDeadlineMechanicChange
                                            }
                                            disabled={
                                              (!formData.autoStartDate &&
                                                !formData.autoEndDate) ||
                                              formData.statusMechanic == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* checkbox install */}
                                    <div className="flex flex-row gap-1 items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.statusInstall == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusInstall: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineInstall: e.target.checked
                                              ? prevForm.deadlineInstall
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.autoStartDate &&
                                            !formData.autoEndDate) ||
                                            formData.statusInstall == 3 ||
                                          formData.statusSuccessAuto == 3
                                        }
                                      />
                                      <span>Install</span>
                                      {/* deadline install */}
                                      <div className="flex flex-row gap-2 w-full">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineInstallRef}
                                            date={
                                              formData.statusInstall != 1
                                                ? formData.deadlineInstall
                                                : null
                                            }
                                            setDate={
                                              handleDeadlineInstallChange
                                            }
                                            disabled={
                                              (!formData.autoStartDate &&
                                                !formData.autoEndDate) ||
                                              formData.statusInstall == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                      {/* checkbox safety check */}
                                      <div className="flex flex-row gap-1 items-center">
                                        <input
                                          id="status"
                                          type="checkbox"
                                          checked={
                                            formData.statusSafetyCheck == 2
                                          }
                                          onChange={(e) => {
                                            setFormData((prevForm) => ({
                                              ...prevForm,
                                              statusSafetyCheck: e.target
                                                .checked
                                                ? 2
                                                : 1,
                                              deadlineSafetyCheck: e.target
                                                .checked
                                                ? prevForm.deadlineSafetyCheck
                                                : null,
                                            }));
                                          }}
                                          className="checkbox"
                                          disabled={
                                            (!formData.autoStartDate &&
                                              !formData.autoEndDate) ||
                                              formData.statusSafetyCheck == 3 ||
                                            formData.statusSuccessAuto == 3
                                          }
                                        />
                                        <span>Safety Check</span>
                                        {/* deadline safety check */}
                                        <div className="flex flex-row gap-2 w-full">
                                          <div className="relative">
                                            <CalendarInput
                                              ref={deadlineSafetyCheckRef}
                                              date={
                                                formData.statusSafetyCheck != 1
                                                  ? formData.deadlineSafetyCheck
                                                  : null
                                              }
                                              setDate={
                                                handleDeadlineSafetyCheckChange
                                              }
                                              disabled={
                                                (!formData.autoStartDate &&
                                                  !formData.autoEndDate) ||
                                                formData.statusSafetyCheck == 1
                                              }
                                            />
                                            {/* icon calendar */}
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-calendar3"
                                                viewBox="0 0 16 16"
                                              >
                                                <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                                <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* checkbox test run */}
                                    <div className="flex flex-row gap-5 items-center">
                                      <input
                                        id="status"
                                        type="checkbox"
                                        checked={formData.statusTestRun == 2}
                                        onChange={(e) => {
                                          setFormData((prevForm) => ({
                                            ...prevForm,
                                            statusTestRun: e.target.checked
                                              ? 2
                                              : 1,
                                            deadlineTestRun: e.target.checked
                                              ? prevForm.deadlineTestRun
                                              : null,
                                          }));
                                        }}
                                        className="checkbox"
                                        disabled={
                                          (!formData.autoStartDate &&
                                            !formData.autoEndDate) ||
                                            formData.statusTestRun == 3 ||
                                          formData.statusSuccessAuto == 3
                                        }
                                      />
                                      <span>Test run</span>
                                      {/* deadline test run */}
                                      <div className="flex flex-row gap-2">
                                        <div className="relative">
                                          <CalendarInput
                                            ref={deadlineTestRunRef}
                                            date={
                                              formData.statusTestRun != 1
                                                ? formData.deadlineTestRun
                                                : null
                                            }
                                            setDate={
                                              handleDeadlineTestRunChange
                                            }
                                            disabled={
                                              (!formData.autoStartDate &&
                                                !formData.autoEndDate) ||
                                              formData.statusTestRun == 1
                                            }
                                          />
                                          {/* icon calendar */}
                                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-calendar3"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                              <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {/* checkbox programmer */}
                        <div className="flex items-center gap-2">
                          <input
                            ref={programmerDepartmentRef}
                            id="department-programmer"
                            type="checkbox"
                            checked={formData.checkedProgrammer == 1}
                            onChange={(e) => {
                              setFormData((prevForm) => ({
                                ...prevForm,
                                checkedProgrammer: e.target.checked ? 1 : 0,
                              }));
                            }}
                            disabled={
                              !formData.projectStart && !formData.projectEnd
                            }
                            className="checkbox"
                          />
                          <label
                            className="w-full"
                            htmlFor="department-programmer"
                          >
                            Programmer
                          </label>
                        </div>
                        {formData.checkedProgrammer == 1 ? (
                          <>
                            <div className="flex flex-col gap-3 border-2 border-orange-300 p-3 rounded-md w-full h-fit overflow-visible">
                              <div>
                                <label
                                  htmlFor="programmer"
                                  className="font-bold text-[#45474B]"
                                >
                                  <span className="text-red-600 font-bold">
                                    *
                                  </span>
                                  Programmer
                                </label>
                                <div className="w-full h-full mx-auto">
                                  {/* Container for Selected Options and Input */}
                                  <div
                                    className="relative flex items-center p-2 gap-2 flex-wrap border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-0"
                                    style={{ minHeight: "50px" }}
                                    onClick={handleInputClickProgrammer}
                                  >
                                    {/* Display "Select Staff" if no input or selectedUser */}
                                    {formData.selectedProgrammer.length == 0 &&
                                      !formData.searchProgrammer && (
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                          Select Staff
                                        </div>
                                      )}

                                    {/* Display Selected Chips inside the input */}
                                    {formData.selectedProgrammer.map(
                                      (option, index) => {
                                        //console.log("Option2:", option);
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center bg-[#F0EBCC] rounded-full py-1 pl-2 pr-1 text-black w-auto h-auto"
                                          >
                                            <span>{option}</span>
                                            <button
                                              className="ml-2 text-gray-500"
                                              onClick={() =>
                                                handleRemoveOptionProgrammer(
                                                  index
                                                )
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        );
                                      }
                                    )}

                                    {/* Input for searching and selecting options */}
                                    <input
                                      ref={programmerRef}
                                      type="text"
                                      autoComplete="off"
                                      className="bg-white text-black border-b-2 border-t-0 border-l-0 border-r-0 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex-grow"
                                      onChange={handleSearchChangeProgrammer}
                                      onKeyDown={handleKeyDownProgrammer}
                                      value={formData.searchProgrammer}
                                      autoFocus
                                      style={{
                                        minWidth: "120px",
                                        border: "none",
                                        outline: "none",
                                      }}
                                      id="programmer"
                                    />
                                  </div>

                                  {/* Dropdown for options */}
                                  {formData.searchProgrammer && (
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu p-2 shadow bg-white rounded-box w-full mt-2"
                                    >
                                      {filteredOptionsProgrammer.length > 0 ? (
                                        filteredOptionsProgrammer.map(
                                          (option, index) => {
                                            //console.log("Option:", option); // ✅ log ข้อมูลก่อน return
                                            return (
                                              <li
                                                key={index}
                                                onClick={(e) =>
                                                  handleSelectChangeProgrammer(
                                                    option,
                                                    e
                                                  )
                                                }
                                                className={`cursor-pointer hover:bg-gray-100 p-2 flex items-center ${
                                                  formData.highlightedIndexProgrammer ===
                                                  index
                                                    ? "bg-gray-200"
                                                    : ""
                                                }`}
                                              >
                                                {option.username}{" "}
                                                {option.lastname}
                                              </li>
                                            );
                                          }
                                        )
                                      ) : (
                                        <li className="p-2">
                                          No results found
                                        </li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row justify-between gap-5 w-full h-full">
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="programmer-startdate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project Start (Programmer)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={programmerStartDateRef}
                                      date={formData.programmerStartDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          programmerStartDate: selectedDate,
                                        }))
                                      }
                                      id="programmer-startdate"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full h-full">
                                  <label
                                    htmlFor="programmer-enddate"
                                    className="font-bold text-[#45474B]"
                                  >
                                    <span className="text-red-600 font-bold">
                                      *
                                    </span>
                                    Project End (Programmer)
                                  </label>
                                  <div className="relative">
                                    <CalendarInput
                                      ref={programmerEndDateRef}
                                      date={formData.programmerEndDate}
                                      setDate={(selectedDate) =>
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          programmerEndDate: selectedDate,
                                        }))
                                      }
                                      id="programmer-enddate"
                                    />

                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-calendar3"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="w-auto h-auto px-12 py-2 rounded-lg mt-5 shadow font-extrabold text-sm text-white bg-[#FFA24C] hover:bg-[#FFAF00] focus:ring-4 focus:outline-none focus:ring-yellow-400 dark:focus:ring-orange-800"
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>Loading project details...</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* <Banner /> x*/}
      </div>
    </div>
  );
});
export default EditProject;

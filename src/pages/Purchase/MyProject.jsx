import React, { useState, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import FilterButton from "../../components/DropdownFilter";
import Datepicker from "../../components/Datepicker";

import axios from "axios";
import { PurchaseTable } from "../../components/PurchaseTable";

function MyProject() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //const [searchText, setSearchText] = useState("");
  //const [showMyProjectData, setShowMyProjectData] = useState([]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow mt-[-24px]">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-10xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                {/* <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold font-LexendDeca">
                My Project
                </h1> */}
              </div>

              {/* Right: Actions */}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6">
              {/* Card (Customers) */}
              <PurchaseTable TitleTable="My Project List" />
            </div>
          </div>
        </main>

        {/* <Banner /> */}
      </div>
    </div>
  );
}

export default MyProject;

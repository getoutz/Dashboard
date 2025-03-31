import React, { useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
// import FilterButton from '../../components/DropdownFilter';
// import Datepicker from '../../components/Datepicker';
import { ProgrammerTable } from "../../components/ProgrammerTable";

function AllProject() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow -my-6 -mx-2">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-10xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0"></div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6">
              {/* Card (Customers) */}
              <ProgrammerTable />
            </div>
          </div>
        </main>

        {/* <Banner /> */}
      </div>
    </div>
  );
}

export default AllProject;

import React, { useState } from "react";

function SidebarLinkGroup({ children, activecondition }) {
  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-gradient-to-r from-[#FFF455]/40 to-[#FF6E31]/40`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;

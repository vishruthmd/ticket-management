import React from "react";
import { Outlet } from "react-router-dom";

import NavbarTechnician from "../components/NavbarTechnician";

const LayoutTechnician = () => {
  return (
    <div>
      <NavbarTechnician />
      <Outlet/>
    </div>
  );
};

export default LayoutTechnician;
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

const LayoutAdmin = () => {
  return (
    <div>
      <NavbarAdmin />
      <Outlet />
    </div>
  );
};

export default LayoutAdmin;


import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import NavbarCoordinator from "../components/NavbarCoordinator";

const Layout = () => {
  return (
    <div>
      <NavbarCoordinator />
      <Outlet />
    </div>
  );
};

export default Layout;


import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import NavbarCoordinator from "../components/NavbarCoordinator";
import CreateTicketPage from "../pages/CreateTicketPage";

const LayoutCoordinator = () => {
  return (
    <div>
      <NavbarCoordinator />
      <Outlet />
    </div>
  );
};

export default LayoutCoordinator;


import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import NavbarCoordinator from "../components/NavbarCoordinator";
import CreateTicketPage from "../pages/CreateTicketPage";

const LayoutCoordinator = () => {
  return (
    <div>
      <CreateTicketPage/>
      <NavbarCoordinator />
      
    </div>
  );
};

export default LayoutCoordinator;


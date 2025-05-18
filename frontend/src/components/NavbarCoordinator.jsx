import React from "react";
import { User, PlusCircle, List, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import appLogo from '../assets/logo.png';


const NavbarCoordinator = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="w-screen fixed top-0 left-0 z-50 bg-base-100 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img
            src={appLogo} // Use the variable you imported
            alt="RVCE logo"
            className="h-12 invert"
          />
          <span className="hidden sm:block">         Call Log App</span>
        </Link>

        {/* Navigation Options */}
        <div className="flex gap-6 items-center">
          <Link
            to="/create-ticket"
            className="btn btn-ghost hover:bg-primary hover:text-white flex gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Ticket
          </Link>

          <Link
            to="/view-tickets"
            className="btn btn-ghost hover:bg-primary hover:text-white flex gap-2"
          >
            <List className="w-4 h-4" />
            View Tickets
          </Link>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2"
            >
              <li className="text-base font-semibold px-2">
                {authUser?.name}
                <hr className="my-1 border-gray-200" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-primary hover:text-white flex gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>
              <li>
                <LogoutButton className="hover:bg-primary hover:text-white flex gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarCoordinator;

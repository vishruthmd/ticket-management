import React from "react";
import {  User,  UserPlus,  Settings,  Users,  List,  LogOut,  ShieldCheck,} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import appLogo from "../assets/logo.png";

const NavbarAdmin = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-6xl">
      <div className="bg-base-100 bg-opacity-90 backdrop-blur-md shadow-xl border border-gray-700 rounded-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <img src={appLogo} alt="RVCE logo" className="h-10 invert" />
            <span className="px-10 sm:block">Call Log App</span>
          </Link>

          {/* Navigation Options */}
          <div className="flex gap-3 items-center">
            <Link
              to="/create-user"
              className="btn btn-sm rounded-full btn-ghost hover:bg-primary hover:text-white flex gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden md:inline">Create User</span>
            </Link>

            <Link
              to="/assign-technician"
              className="btn btn-sm rounded-full btn-ghost hover:bg-primary hover:text-white flex gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Assign Technician</span>
            </Link>

            <Link
              to="/view-technicians"
              className="btn btn-sm rounded-full btn-ghost hover:bg-primary hover:text-white flex gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">View Technicians</span>
            </Link>

            <Link
              to="/view-coordinators"
              className="btn btn-sm rounded-full btn-ghost hover:bg-primary hover:text-white flex gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">View Coordinators</span>
            </Link>
            <Link
                to="/view-department-tickets"
                className="btn btn-sm rounded-full btn-ghost hover:bg-primary hover:text-white flex gap-2"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">Dept Tickets</span>
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
    </div>
  );
};

export default NavbarAdmin;

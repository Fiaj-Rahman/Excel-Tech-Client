import React from "react";
import { Outlet } from "react-router-dom";
import UserNavBar from "../UserNavbar/UserNavbar";

const UserLayOut = () => {
  return (
    <div className="relative z-80 min-h-screen flex">
      {/* Sidebar */}
      <UserNavBar />

      {/* Main Content */}
      <div className="flex-1 mt-12 sm: w-full"> {/* Added mt-12 for spacing due to the fixed AppBar */}
        <div className="p-5">
          {/* This is where child routes will be rendered */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayOut;

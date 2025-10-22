import React from "react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b">
      {/* Logo  */}
      <div>
        <img src={logo} alt="logo" />
      </div>

      {/* Searching  */}
      <div className="w-[500px]">
        <SearchBox />
      </div>

      {/* Button  */}
      <div>
        <Button asChild>
          <Link to="" className="rounded-full">
            <MdLogin />
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Topbar;

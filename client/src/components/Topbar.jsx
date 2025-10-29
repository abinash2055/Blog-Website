import React, { useState } from "react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import {
  RouteBlogAdd,
  RouteIndex,
  RouteProfile,
  RouteSignIn,
} from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import usericon from ".././assets/images/user.png";
import { FaRegUser, FaPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { removeUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { useSidebar } from "./ui/sidebar";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const { toggleSidebar } = useSidebar();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
        { method: "get", credentials: "include" }
      );
      const data = await response.json();
      if (!response.ok) return showToast("error", data.message);

      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-gray-900 px-5 border-b border-gray-700 shadow-lg">
      {/* Logo Section (unchanged) */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={toggleSidebar}
          type="button"
          className="md:hidden p-2 rounded hover:bg-gray-800 transition"
        >
          <AiOutlineMenu size={22} className="text-white" />
        </button>
        <Link to={RouteIndex}>
          <img src={logo} alt="logo" className="md:w-auto w-48" />
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 flex justify-center relative">
        <div className="hidden md:block w-1/2 max-w-md shadow-md rounded-lg overflow-hidden border border-gray-700">
          <SearchBox className="bg-gray-800 text-white placeholder-gray-400" />
        </div>

        {showSearch && (
          <div className="absolute top-16 left-0 w-full p-4 bg-gray-800 z-30 shadow-xl md:hidden rounded-b-lg border border-gray-700">
            <SearchBox className="bg-gray-700 text-white placeholder-gray-400" />
          </div>
        )}
      </div>

      {/* Buttons & User */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={toggleSearch}
          className="md:hidden p-2 rounded-full hover:bg-gray-800 transition"
        >
          <IoMdSearch size={22} className="text-white" />
        </button>

        {/* Sign In / User Dropdown */}
        {!user.isLoggedIn ? (
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 flex items-center gap-2 shadow-lg transition transform hover:scale-105"
          >
            <Link to={RouteSignIn}>
              <MdLogin size={20} />
              Sign In
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <Avatar className="border-2 border-purple-500 hover:scale-105 transition-transform shadow-lg">
                <AvatarImage src={user.user?.avatar || usericon} />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            {/* Light-themed dropdown menu */}
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-2">
              <DropdownMenuLabel className="flex flex-col gap-1 text-gray-900">
                <p className="font-semibold">{user.user.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user.user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-gray-200" />

              <DropdownMenuItem
                asChild
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-100 hover:text-purple-700 transition cursor-pointer"
              >
                <Link to={RouteProfile}>
                  <FaRegUser size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-100 hover:text-green-700 transition cursor-pointer"
              >
                <Link to={RouteBlogAdd}>
                  <FaPlus size={16} />
                  Create Blog
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="border-gray-200" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-red-100 hover:text-red-600 transition cursor-pointer"
              >
                <IoLogOutOutline size={18} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Topbar;

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo-white.png";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUser,
} from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "get",
      credentials: "include",
    }
  );

  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar className="bg-gray-900 text-white border-r border-gray-800 shadow-lg">
      {/* Logo */}
      <SidebarHeader className="bg-gray-900 flex justify-center items-center py-4">
        <img src={logo} alt="logo" width={120} className="drop-shadow-lg" />
      </SidebarHeader>

      <SidebarContent className="bg-gray-900 p-4 space-y-4">
        <SidebarGroup>
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive(RouteIndex)
                    ? "bg-gray-800 text-blue-400 font-bold shadow-md"
                    : "hover:bg-gray-700 hover:text-blue-400 text-white"
                }`}
              >
                <IoHomeOutline className="text-white group-hover:text-blue-400 text-lg" />
                <Link to={RouteIndex}>Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user && user.isLoggedIn && (
              <>
                {/* Blogs */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive(RouteBlog)
                        ? "bg-gray-800 text-green-400 font-bold shadow-md"
                        : "hover:bg-gray-700 hover:text-green-400 text-white"
                    }`}
                  >
                    <GrBlog className="text-white group-hover:text-green-400 text-lg" />
                    <Link to={RouteBlog}>Blogs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Comments */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive(RouteCommentDetails)
                        ? "bg-gray-800 text-purple-400 font-bold shadow-md"
                        : "hover:bg-gray-700 hover:text-purple-400 text-white"
                    }`}
                  >
                    <FaRegComments className="text-white group-hover:text-purple-400 text-lg" />
                    <Link to={RouteCommentDetails}>Comments</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}

            {user && user.isLoggedIn && user.user.role === "admin" && (
              <>
                {/* Categories */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive(RouteCategoryDetails)
                        ? "bg-gray-800 text-orange-400 font-bold shadow-md"
                        : "hover:bg-gray-700 hover:text-orange-400 text-white"
                    }`}
                  >
                    <BiCategoryAlt className="text-white group-hover:text-orange-400 text-lg" />
                    <Link to={RouteCategoryDetails}>Categories</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Users */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive(RouteUser)
                        ? "bg-gray-800 text-red-400 font-bold shadow-md"
                        : "hover:bg-gray-700 hover:text-red-400 text-white"
                    }`}
                  >
                    <LuUsers className="text-white group-hover:text-red-400 text-lg" />
                    <Link to={RouteUser}>Users</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 text-xs uppercase tracking-wide mt-4 mb-2">
            Categories
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {categoryData &&
              categoryData.category.length > 0 &&
              categoryData.category.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <SidebarMenuButton
                    className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                      isActive(RouteBlogByCategory(category.slug))
                        ? "bg-gray-800 text-yellow-400 font-bold shadow-sm"
                        : "hover:bg-gray-700 hover:text-yellow-400 text-white"
                    }`}
                  >
                    <GoDot className="text-white group-hover:text-yellow-400 text-sm" />
                    <Link to={RouteBlogByCategory(category.slug)}>
                      {category.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

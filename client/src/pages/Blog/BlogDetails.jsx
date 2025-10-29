import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import Loading from "@/components/Loading";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from "moment";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-all`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    const response = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/blog/delete/${id}`
    );

    if (response) {
      setRefreshData((prev) => !prev);
      showToast("success", "Blog deleted successfully.");
    } else {
      console.error("Delete error:", error);
      showToast("error", "Something went wrong while deleting.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error loading blogs.</p>;

  return (
    <div className="p-4 md:p-6">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-violet-50 px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Blog Details</h2>
          <Button
            asChild
            className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Link to={RouteBlogAdd}>Add Blog</Link>
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto px-4 py-5 bg-gray-50">
          <Table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
            <TableHeader className="bg-gray-100">
              <TableRow>
                {["Author", "Category", "Title", "Slug", "Dated", "Action"].map(
                  (header) => (
                    <TableHead
                      key={header}
                      className="text-left px-4 py-3 text-gray-800 uppercase tracking-wide text-sm"
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-gray-200">
              {blogData?.blog?.length > 0 ? (
                blogData.blog.map((blog) => (
                  <TableRow
                    key={blog._id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <TableCell className="px-4 py-2 text-gray-700 font-medium">
                      {blog?.author?.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-600">
                      {blog?.category?.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-800 font-semibold">
                      {blog?.title}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-500 truncate max-w-xs">
                      {blog?.slug}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-500">
                      {moment(blog?.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex flex-col sm:flex-row gap-2 sm:gap-2">
                      <Button
                        variant="outline"
                        className="hover:bg-violet-500 hover:text-white p-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none"
                        asChild
                      >
                        <Link to={RouteBlogEdit(blog._id)}>
                          <FiEdit className="text-lg" />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog._id)}
                        variant="outline"
                        className="hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none"
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No Blog found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;

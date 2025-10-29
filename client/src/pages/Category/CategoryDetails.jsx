import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const CategoryDetails = () => {
  const [refreshData, setRefreshData] = useState(false);

  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/category/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json(); // ← parse JSON

      if (response.ok) {
        setRefreshData((prev) => !prev);
        showToast("success", data.message);
      } else {
        showToast(
          "error",
          data.message || "Something went wrong while deleting."
        );
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Something went wrong while deleting.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error loading categories.</p>;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Category List</h2>
          <Button
            asChild
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Link to={RouteAddCategory}>Add Category</Link>
          </Button>
        </CardHeader>

        <CardContent className="overflow-x-auto px-4 py-3">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Category
                </TableHead>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Slug
                </TableHead>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-gray-200">
              {categoryData?.category?.length > 0 ? (
                categoryData.category.map((category) => (
                  <TableRow
                    key={category._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="px-4 py-2 text-gray-700 font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-500">
                      {category.slug}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex gap-2">
                      <Button
                        variant="outline"
                        className="hover:bg-violet-500 hover:text-white p-2 rounded-lg transition-all duration-200"
                        asChild
                      >
                        <Link to={RouteEditCategory(category._id)}>
                          <FiEdit className="text-lg" />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(category._id)}
                        variant="outline"
                        className="hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all duration-200"
                      >
                        <FaRegTrashAlt className="text-lg" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-gray-500"
                  >
                    No categories found.
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

export default CategoryDetails;

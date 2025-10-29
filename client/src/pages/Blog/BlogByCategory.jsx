import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useParams } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

const BlogByCategory = () => {
  const { category } = useParams();
  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog-by-category/${category}`,
    {
      method: "get",
      credentials: "include",
    },
    [category]
  );

  if (loading) return <Loading />;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-6">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8 border-b pb-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-violet-600">
          <BiCategory className="text-3xl" />
          <h2 className="text-xl md:text-2xl">
            {blogData?.categoryData?.name || "Category"}
          </h2>
        </div>
        <p className="text-gray-600 mt-2 sm:mt-0">
          {blogData?.blog?.length} blog{blogData?.blog?.length !== 1 && "s"}{" "}
          found
        </p>
      </div>

      {/* Blog Grid */}
      {blogData?.blog?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {blogData.blog.map((blog) => (
            <BlogCard key={blog._id} props={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-10">
          No blogs found in this category.
        </div>
      )}
    </div>
  );
};

export default BlogByCategory;

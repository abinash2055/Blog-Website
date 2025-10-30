import { getEnv } from "@/helpers/getEnv";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "@/components/BlogCard";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/blog/search?q=${q}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setBlogData(data.blog || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [q]); // <-- re-run when query changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5">
        <h4>Search Result for: {q}</h4>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {blogData.length > 0 ? (
          blogData.map((blog) => <BlogCard key={blog._id} props={blog} />)
        ) : (
          <div>Data Not Found.</div>
        )}
      </div>
    </>
  );
};

export default SearchResult;

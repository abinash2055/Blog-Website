// import { getEnv } from "@/helpers/getEnv";
// import { RouteBlogDetails } from "@/helpers/RouteName";
// import { useFetch } from "@/hooks/useFetch";
// import React from "react";
// import { Link } from "react-router-dom";

// const RelatedBlog = ({ props }) => {
//   const { data, loading, error } = useFetch(
//     `${getEnv("VITE_API_BASE_URL")}/blog/get-related-blog/${props.category}/${
//       props.currentBlog
//     }`,
//     {
//       method: "get",
//       credentials: "include",
//     }
//   );

//   if (loading) return <div>Loading....</div>;

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-5">Related Blogs</h2>
//       <div>
//         {data?.relatedBlog?.length > 0 ? (
//           data.relatedBlog.map((blog) => (
//             <Link
//               key={blog._id}
//               to={RouteBlogDetails(props.category, blog.slug)}
//             >
//               <div className="flex items-center gap-2 mb-3">
//                 <img
//                   className="w-[100px] h-[70px] object-cover rounded-md"
//                   src={blog.featuredImage}
//                   alt="feature images"
//                 />
//                 <h4 className="line-clamp-2 text-lg font-semibold">
//                   {blog.title}
//                 </h4>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div>No related Blogs</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RelatedBlog;

import { getEnv } from "@/helpers/getEnv";
import { RouteBlogDetails } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Link } from "react-router-dom";

const RelatedBlog = ({ props }) => {
  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-related-blog/${props.category}/${
      props.currentBlog
    }`,
    {
      method: "get",
      credentials: "include",
    }
  );

  if (loading)
    return (
      <div className="text-gray-500 italic text-center py-4">Loading...</div>
    );

  return (
    <div className="bg-gray-50 p-5 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b border-gray-200 pb-2">
        Related Blogs
      </h2>
      <div className="space-y-3">
        {data?.relatedBlog?.length > 0 ? (
          data.relatedBlog.map((blog) => (
            <Link
              key={blog._id}
              to={RouteBlogDetails(props.category, blog.slug)}
            >
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <img
                  className="w-24 h-16 md:w-28 md:h-20 object-cover rounded-md flex-shrink-0"
                  src={blog.featuredImage}
                  alt="feature image"
                />
                <h4 className="line-clamp-2 text-lg font-semibold text-gray-800 hover:text-violet-600 transition-colors duration-200">
                  {blog.title}
                </h4>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500 italic">No related blogs found.</div>
        )}
      </div>
    </div>
  );
};

export default RelatedBlog;

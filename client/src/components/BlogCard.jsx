// import React from "react";
// import { Card, CardContent } from "./ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import usericon from "../assets/images/user.png";
// import moment from "moment";
// import { Link } from "react-router-dom";
// import { RouteBlogDetails } from "@/helpers/RouteName";

// const BlogCard = ({ props }) => {
//   return (
//     <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
//       <Card className="pt-5">
//         <CardContent>
//           <div className="flex items-center justify-between">
//             <div className="flex justify-between items-center gap-2">
//               <Avatar>
//                 <AvatarImage
//                   src={props?.author?.avatar || usericon}
//                   alt="avatar"
//                 />
//               </Avatar>
//               <span>{props?.author?.name}</span>
//             </div>
//             {props?.author?.role === "admin" && (
//               <Badge variant="outline" className="bg-violet-500">
//                 Admin
//               </Badge>
//             )}
//           </div>

//           {/* For Featured Image  */}
//           <div className="my-2">
//             <img
//               src={props?.featuredImage}
//               alt="Feature Image"
//               className="rounded"
//             />
//           </div>

//           {/* For Title and Date  */}
//           <div>
//             <p className="flex items-center gap-2 mb-2">
//               <FaRegCalendarAlt />
//               <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
//             </p>
//             <h2 className="text-2xl font-bold line-clamp-2">{props.title}</h2>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// };

// export default BlogCard;

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from "../assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ props }) => {
  return (
    <Link to={RouteBlogDetails(props?.category?.slug, props?.slug)}>
      <Card className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-5 space-y-3 text-gray-900">
          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 ring-2 ring-violet-200">
                <AvatarImage
                  src={props?.author?.avatar || usericon}
                  alt="avatar"
                />
              </Avatar>
              <span className="font-medium text-sm">{props?.author?.name}</span>
            </div>

            {props?.author?.role === "admin" && (
              <Badge
                variant="outline"
                className="bg-violet-100 text-violet-700 border border-violet-300"
              >
                Admin
              </Badge>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={props?.featuredImage}
              alt="Feature Image"
              className="w-full h-48 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Title + Date */}
          <div className="mt-2">
            <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <FaRegCalendarAlt className="text-violet-500" />
              <span>{moment(props.createdAt).format("DD MMM YYYY")}</span>
            </p>
            <h2 className="text-lg font-semibold leading-snug hover:text-violet-600 transition-colors duration-300 line-clamp-2">
              {props.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;

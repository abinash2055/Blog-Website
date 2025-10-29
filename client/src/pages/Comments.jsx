// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useFetch } from "@/hooks/useFetch";
// import { getEnv } from "@/helpers/getEnv";
// import Loading from "@/components/Loading";
// import { FiEdit } from "react-icons/fi";
// import { FaRegTrashAlt } from "react-icons/fa";
// import { deleteData } from "@/helpers/handleDelete";
// import { showToast } from "@/helpers/showToast";

// const Comments = () => {
//   const [refreshData, setRefreshData] = useState(false);

//   const { data, loading, error } = useFetch(
//     `${getEnv("VITE_API_BASE_URL")}/comment/get-all-comment`,
//     {
//       method: "get",
//       credentials: "include",
//     },
//     [refreshData]
//   );

//   const handleDelete = async (id) => {
//     const response = await deleteData(
//       `${getEnv("VITE_API_BASE_URL")}/comment/delete/${id}`
//     );

//     if (response) {
//       setRefreshData(!refreshData);
//       showToast("success", "Comment deleted successfully.");
//     } else {
//       showToast("error", "Something went wrong while deleting.");
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div>
//       <Card>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Blog</TableHead>
//                 <TableHead>Commented By</TableHead>
//                 <TableHead>Comment</TableHead>
//                 <TableHead>Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data && data.comments.length > 0 ? (
//                 data.comments.map((comment) => (
//                   <TableRow key={comment._id}>
//                     <TableCell>{comment?.blogid?.title}</TableCell>
//                     <TableCell>{comment?.user?.name}</TableCell>
//                     <TableCell>{comment?.comment}</TableCell>
//                     <TableCell className="flex gap-3">
//                       <Button
//                         onClick={() => handleDelete(comment._id)}
//                         variant="outline"
//                         className="hover:bg-violet-500 hover:text-white"
//                       >
//                         <FaRegTrashAlt />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan="3">No Comments found.</TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Comments;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState } from "react";
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
import { FaRegTrashAlt } from "react-icons/fa";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const Comments = () => {
  const [refreshData, setRefreshData] = useState(false);

  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/comment/get-all-comment`,
    {
      method: "get",
      credentials: "include",
    },
    [refreshData]
  );

  const handleDelete = async (id) => {
    const response = await deleteData(
      `${getEnv("VITE_API_BASE_URL")}/comment/delete/${id}`
    );

    if (response) {
      setRefreshData(!refreshData);
      showToast("success", "Comment deleted successfully.");
    } else {
      showToast("error", "Something went wrong while deleting.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Error loading comments.</p>;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Comments List</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto px-4 py-3">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Blog
                </TableHead>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Commented By
                </TableHead>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Comment
                </TableHead>
                <TableHead className="text-left px-4 py-2 text-gray-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white divide-y divide-gray-200">
              {data && data.comments.length > 0 ? (
                data.comments.map((comment) => (
                  <TableRow
                    key={comment._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="px-4 py-2 text-gray-700">
                      {comment?.blogid?.title}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-700">
                      {comment?.user?.name}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-gray-800">
                      {comment?.comment}
                    </TableCell>
                    <TableCell className="px-4 py-2 flex gap-2">
                      <Button
                        onClick={() => handleDelete(comment._id)}
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
                    colSpan={4}
                    className="text-center py-4 text-gray-500"
                  >
                    No comments found.
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

export default Comments;

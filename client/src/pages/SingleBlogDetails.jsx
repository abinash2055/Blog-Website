import React, { useState } from "react";
import Comment from "@/components/Comment";
import CommentCount from "@/components/CommentCount";
import LikeCount from "@/components/LikeCount";
import RelatedBlog from "@/components/RelatedBlog";
import Loading from "@/components/Loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { decode } from "entities";
import moment from "moment";
import { useParams } from "react-router-dom";

const SingleBlogDetails = () => {
  const { blog, category } = useParams();
  const [newComment, setNewComment] = useState(null); // 🔥 shared comment state

  const { data, loading } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-blog/${blog}`,
    { method: "get", credentials: "include" },
    [blog, category]
  );

  if (loading) return <Loading />;

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      {data && data.blog && (
        <>
          {/* Blog Section */}
          <div className="border rounded md:w-[70%] w-full p-5">
            <h1 className="text-2xl font-bold mb-5">{data.blog.title}</h1>

            {/* Author Info */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <Avatar>
                  <AvatarImage src={data.blog.author?.avatar} alt="avatar" />
                </Avatar>
                <div>
                  <p className="font-bold">{data.blog.author?.name}</p>
                  <p>
                    Date: {moment(data.blog.createdAt).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <LikeCount props={{ blogid: data.blog._id }} />
                {/* 🔥 Pass newComment to trigger re-fetch */}
                <CommentCount props={{ blogid: data.blog._id, newComment }} />
              </div>
            </div>

            {/* Featured Image */}
            <div className="my-5">
              <img
                src={data.blog.featuredImage}
                alt="Featured"
                className="rounded"
              />
            </div>

            {/* Blog Content */}
            <div
              dangerouslySetInnerHTML={{
                __html: decode(data.blog.blogContent) || "",
              }}
            ></div>

            {/* Comments */}
            <div className="border-t mt-5 pt-5">
              <Comment
                props={{ blogid: data.blog._id }}
                onNewComment={setNewComment} // 🔥 notify parent
              />
            </div>
          </div>
        </>
      )}

      {/* Related Blogs */}
      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category, currentBlog: blog }} />
      </div>
    </div>
  );
};

export default SingleBlogDetails;

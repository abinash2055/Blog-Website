import { FaHeart } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";
import { showToast } from "@/helpers/showToast";

const LikeCount = ({ props }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const user = useSelector((state) => state.user);
  const {
    data: BlogLikeCount,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog-like/get-like/${props.blogid}/${
      user && user.isLoggedIn ? user.user._id : ""
    }`,
    {
      method: "get",
      credentials: "include",
    }
  );

  // console.log(BlogLikeCount);

  useEffect(() => {
    if (BlogLikeCount) {
      setLikeCount(BlogLikeCount.likecount);
      setHasLiked(BlogLikeCount.isUserliked);
    }
  }, [BlogLikeCount]);

  // const handleLike = async () => {
  //   try {
  //     if (!user.isLoggedIn) {
  //       return showToast("error", "Please login into your Account.");
  //     }

  //     const response = await fetch(
  //       `${getEnv("VITE_API_BASE_URL")}/blog-like/do-like`,
  //       {
  //         method: "post",
  //         credentials: "include",
  //         headers: { "Content-type": "application/json" },
  //         body: JSON.stringify({ user: user.user._id, blogid: props.blogid }),
  //       }
  //     );

  //     if (!response.ok) {
  //       showToast("error", response.statusText);
  //     }

  //     const responseData = await response.json();
  //     setLikeCount(responseData.likecount);
  //     setHasLiked(!hasLiked);
  //   } catch (error) {
  //     showToast("error", error.message);
  //   }
  // };

  const handleLike = async () => {
    try {
      if (!user.isLoggedIn) return showToast("error", "Please login.");

      // Optimistic UI update
      setHasLiked(!hasLiked);
      setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog-like/do-like`,
        {
          method: "post",
          credentials: "include",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ user: user.user._id, blogid: props.blogid }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const responseData = await response.json();
      setLikeCount(responseData.likecount); // sync with server
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <button
      onClick={handleLike}
      type="button"
      className="flex justify-between items-center gap-1"
    >
      {!hasLiked ? <FaHeart /> : <FaHeart color="red" />}
      {likeCount}
    </button>
  );
};

export default LikeCount;

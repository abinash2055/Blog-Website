import { FaRegHeart } from "react-icons/fa";
import React from "react";

const LikeCount = ({ props }) => {
  return (
    <button type="button" className="flex justify-between items-center gap-1">
      <FaRegHeart />0
    </button>
  );
};

export default LikeCount;

import express from "express";
import {
  addComment,
  commentCount,
  deleteComment,
  getAllComments,
  getComments,
} from "../controllers/Comment.controller.js";

const CommentRoute = express.Router();

CommentRoute.post("/add", addComment);

CommentRoute.get("/get/:blogid", getComments);

CommentRoute.get("/get-count/:blogid", commentCount);

CommentRoute.get("/get-all-comment", getAllComments);

CommentRoute.delete("/delete/:commentid", deleteComment);

export default CommentRoute;

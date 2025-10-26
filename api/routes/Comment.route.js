import express from "express";
import {
  addComment,
  commentCount,
  getComments,
} from "../controllers/Comment.controller.js";

const CommentRoute = express.Router();

CommentRoute.post("/add", addComment);

CommentRoute.get("/get/:blogid", getComments);

CommentRoute.get("/get-count/:blogid", commentCount);

export default CommentRoute;

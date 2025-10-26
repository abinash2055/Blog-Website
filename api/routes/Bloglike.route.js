import express from "express";
import { doLike, likeCount } from "../controllers/BlogLike.controller.js";

const BlogLikeRoute = express.Router();

BlogLikeRoute.post("/do-like", doLike);

BlogLikeRoute.get("/get-like/:blogid/:userid", likeCount);

export default BlogLikeRoute;

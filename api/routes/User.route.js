import express from "express";
import { getUser, updateUser } from "../controllers/User.controller.js";

const UserRoute = express.Router();

UserRoute.get("/get-user/:userid", getUser);

UserRoute.put("/update-user/:userid", updateUser);

export default UserRoute;

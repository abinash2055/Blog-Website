import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  showCategory,
  updateCategory,
} from "../controllers/Category.controller.js";
import { authenticate, onlyAdmin } from "../middleware/authenticate.js";

const CategoryRoute = express.Router();

CategoryRoute.post("/add",authenticate,onlyAdmin, addCategory);

CategoryRoute.put("/update/:categoryid",authenticate, onlyAdmin, updateCategory);

CategoryRoute.get("/show/:categoryid", authenticate,onlyAdmin, showCategory);

CategoryRoute.delete("/delete/:categoryid",authenticate, onlyAdmin, deleteCategory);

CategoryRoute.get("/all-category", getAllCategory);

export default CategoryRoute;

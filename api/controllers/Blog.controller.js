import { handleError } from "../helpers/handleError.js";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import { encode } from "entities";

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    let featuredImage = "";

    if (req.file) {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-personal-signature",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleError(500, error.message));
        });
      featuredImage = uploadResult.secure_url;
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog added successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate("category", "name");

    if (!blog) {
      next(handleError(404, "Data not Found."));
    }
    res.status(200).json({
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { blogid } = req.body.params;
    const data = JSON.parse(req.body.data);

    const blog = await Blog.findById(blogid);

    blog.category = data.category;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.blogContent = encode(data.blogContent);

    let featuredImage = blog.featuredImage;

    if (req.file) {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-personal-signature",
          resource_type: "auto",
        })
        .catch((error) => {
          next(handleError(500, error.message));
        });
      featuredImage = uploadResult.secure_url;
    }

    blog.featuredImage = featuredImage;

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    await Blog.findByIdAndDelete(blogid);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    const blog = await Blog.find()
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getRelatedBlog = async (req, res, next) => {
  try {
    const { category, blog } = req.params;
    const categoryData = await Category.findOne({ slug: category });

    if (!categoryData) {
      return next(404, "Category not Found.");
    }
    const categoryId = categoryData._id;

    const relatedBlog = await Blog.find({
      category: categoryId,
      slug: { $ne: blog },
    })
      .lean()
      .exec();

    res.status(200).json({
      relatedBlog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const categoryData = await Category.findOne({ slug: category });

    if (!categoryData) {
      return next(404, "Category not Found.");
    }
    const categoryId = categoryData._id;

    const blog = await Blog.find({ category: categoryId })
      .populate("author", "name avatar role")
      .populate("category", "name slug")
      .lean()
      .exec();

    res.status(200).json({
      blog,
      categoryData,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();
    if (!user) {
      return next(handleError(404, "User not Found."));
    }

    res.status(200).json({
      success: true,
      message: "User data Found.",
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userid } = req.params;

    const user = await User.findById(userid);
    if (!user) return next(handleError(404, "User not found"));

    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio;

    if (data.password && data.password.length >= 8) {
      user.password = bcryptjs.hashSync(data.password);
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog-personal-signature",
        resource_type: "auto",
      });

      user.avatar = uploadResult.secure_url;
      user.isCustomAvatar = true; // mark as custom avatar
    }

    await user.save();

    const newUser = user.toObject({ getters: true });
    delete newUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: newUser,
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted Successfully...",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

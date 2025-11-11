import jwt from "jsonwebtoken";

export const onlyadmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log("Token received:", token);

    if (!token) {
      return res
        .status(403)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodeToken);

    if (decodeToken.role === "admin") {
      req.user = decodeToken;
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized: Admins only" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Authorization failed: " + error.message });
  }
};

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";

// import AuthRoute from "./routes/Auth.route.js";
// import UserRoute from "./routes/User.route.js";
// import CategoryRoute from "./routes/Category.route.js";
// import BlogRoute from "./routes/Blog.route.js";
// import CommentRoute from "./routes/Comment.route.js";
// import BlogLikeRoute from "./routes/Bloglike.route.js";

// dotenv.config();

// // const PORT = process.env.PORT;

// const app = express();

// // CORS must be before other middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         process.env.FRONTEND_URL,
//         "http://localhost:5173",
//         "http://localhost:5174",
//       ];
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//     exposedHeaders: ["Set-Cookie"],
//     optionsSuccessStatus: 200,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// // Mongoose configuration
// mongoose.set("strictQuery", false);

// // Connect to MongoDB first
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_CONN, {
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//     });
//     console.log("✅ Database Connected Successfully");

//     // Start server only after DB connection
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port: ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Database Connection Error:", err.message);
//     console.error("Full error:", err);
//     process.exit(1);
//   }
// };

// connectDB();

// // Route Setup - can be registered before connection
// app.use("/api/auth", AuthRoute);
// app.use("/api/user", UserRoute);
// app.use("/api/category", CategoryRoute);
// app.use("/api/blog", BlogRoute);
// app.use("/api/comment", CommentRoute);
// app.use("/api/blog-like", BlogLikeRoute);

// // Error handler middleware
// app.use((err, _req, res, _next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import AuthRoute from "./routes/Auth.route.js";
import UserRoute from "./routes/User.route.js";
import CategoryRoute from "./routes/Category.route.js";
import BlogRoute from "./routes/Blog.route.js";
import CommentRoute from "./routes/Comment.route.js";
import BlogLikeRoute from "./routes/Bloglike.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log("✅ Database Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ Database Error:", err);
  });

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/blog-like", BlogLikeRoute);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ❗ IMPORTANT FOR VERCEL
export default app;

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectToMogodb from "./db/connectToMongodb.js";
import uploadRouter from "./routes/upload.routes.js";
import profileRouter from "./routes/profile.routes.js"
import path from "path";

dotenv.config();

const port = process.env.PORT;
const __dirname = path.resolve();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://friend-xav2.onrender.com/", // Allow this origin
    credentials: true, // Allow credentials (cookies, headers)
  })
);
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRouter);

app.use("/api/profile",profileRouter)

app.listen(port, () => {
  connectToMogodb();
  console.log(`server is running at http://localhost:${port}`);
});

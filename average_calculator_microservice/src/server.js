import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import numberRoutes from "./routes/number.route.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Average Calculator Microservice is running");
});

app.use("/api", numberRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on PORT:${PORT}`);
});

import express from "express";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import productRouter from "./routes/product.routes.js";

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true                // HTTP-only cookies
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
export default app;
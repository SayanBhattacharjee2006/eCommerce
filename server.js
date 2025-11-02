import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDb from "./config/db.js";
import {ApiResponse} from "./utils/ApiResponse.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// console.log("Mongo URI:", process.env.MONGODB_URI);
connectDb();

const app = express();

//middlewares

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
if(process.env.NODE_ENV === "development") app.use(morgan("dev"));


// routes

app.get("/", (req, res) => (
    res.status(200).json( new ApiResponse(200, "✅ Server is up and running") )
));

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

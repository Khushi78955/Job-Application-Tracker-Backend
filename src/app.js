import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";


import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";
import passport from "./config/passport.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Job Application Tracker API Running",
    })
})

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
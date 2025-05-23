import express, { Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import * as path from "path";
import { ErrorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import http from "http";
import { initSocket } from "./config/socket";
dotenv.config();

const app: Application = express();

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
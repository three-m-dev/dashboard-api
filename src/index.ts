import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import logging from "./config/logging";
import db from "./models/index";

import employeeRoutes from "./routes/employee";

const NAMESPACE = "Server";
const router = express();
const PORT: string = process.env.PORT || "5000";

db.sequelize
  .sync()
  .then(() => {
    logging.info(NAMESPACE, "Database synchronized");
  })
  .catch((err: Error) => {
    logging.error(NAMESPACE, "Error synchronizing database", err);
  });

router.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

router.use(
  cors({
    credentials: true,
  })
);

router.use(compression());
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/api/v1/employees", employeeRoutes);

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}..`);
});

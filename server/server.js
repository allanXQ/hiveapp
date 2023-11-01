require("module-alias/register");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler } = require("@middleware");
const { DBConn, allowedOrigins } = require("@config");

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/tinypesa/", require("@routes"));

app.use(errorHandler);

DBConn(app, port);

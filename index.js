const express = require("express");
const app = express();
const authRoutes = require("./src/route/web");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://prashantku1411:PrA9sfRhajqz7q7x@cluster0.k895ebr.mongodb.net/`,
  { dbName: "secureus" }
);

app.use(express.json());
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.json({ data: "Backend is working." });
});

module.exports = app;

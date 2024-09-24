const express = require("express");
const app = express();
const authRoutes = require("./src/route/web");
const mongoose = require("mongoose");
// Connection to mongoDB
mongoose.connect(
  `mongodb+srv://secureus150:ItL7mdu3XmQKn5ba@cluster0.l2juy.mongodb.net/`,
  { dbName: "secureus" }
);
// const initRoutes = require("./src/route/web");
// initRoutes(app);
// app.use()
app.use(express.json());
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.json({ data: "Backend is working." });
});

app.listen(4000, "0.0.0.0", () => {
  console.log("pokemon");
});

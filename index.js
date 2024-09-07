const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ data: "Backend is working." });
});

app.listen(4000, () => {
  console.log("pokemon");
});

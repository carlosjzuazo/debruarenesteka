require("dotenv").config();
const express = require("express");
const { getPool } = require("./DB/getPool");
const appExpress = express();

appExpress.use(express.json());

appExpress.post("/posting", (req, res) => {
  res.send("Posts subidos");
});

appExpress.get("/getting", (req, res) => {
  res.send("Posts encontrados");
});

appExpress.use((err, req, res, next) => {
  console.error(err.message);

  res.statusCode = 500;

  res.send({
    status: "error",
    message: err.message,
  });
});

appExpress.listen(3306, () => {
  console.log("Server listening at 3000");
});

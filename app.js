const express = require("express");
const {
  getVendingMachines,
  getSingleVendingMachine,
} = require("./controllers/vendingMachine.controllers");
const {
  getSnacks,
  getSnackById,
  postSnack,
} = require("./controllers/snacks.controllers");

const app = express();
app.use(express.json());
app.get("/api/vendingMachines", getVendingMachines);
app.get("/api/vendingMachines/:vend_id", getSingleVendingMachine);
app.get("/api/snacks", getSnacks);
app.post("/api/snacks", postSnack);
app.get("/api/snacks/:snack_id", getSnackById);

app.use((err, req, res, next) => {
  // handle all psql error codes
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  // handle any promise rejections I have to do inside the models
  if (err.message === "Not Found") {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message:
      "I am terrible at code sorry, from your friendly neighbourhood dev.",
  });
});
module.exports = app;

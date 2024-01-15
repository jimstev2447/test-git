const {
  fetchSnacks,
  fetchSnackById,
  insertSnack,
} = require("../models/snacks.models");

module.exports.getSnacks = (req, res, next) => {
  fetchSnacks()
    .then((snacks) => {
      res.status(200).send({ snacks });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getSnackById = (req, res, next) => {
  const { snack_id } = req.params;

  fetchSnackById(snack_id)
    .then((snack) => {
      res.status(200).send({ snack });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.postSnack = (req, res) => {
  const {
    body: { snack },
  } = req;
  insertSnack(snack).then((snack) => {
    res.status(201).send({ snack });
  });
};

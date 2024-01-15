const {
  fetchVendingMachines,
  fetchVendingMachineById,
} = require("../models/vendingMachines.models.js");

module.exports.getVendingMachines = (request, response) => {
  fetchVendingMachines().then((vendingMachines) => {
    response.status(200).send({ vendingMachines });
  });
};

module.exports.getSingleVendingMachine = (request, response, next) => {
  const { vend_id } = request.params;

  fetchVendingMachineById(vend_id)
    .then((vendingMachine) => {
      response.status(200).send({ vendingMachine });
    })
    .catch((err) => {
      next(err);
    });
};

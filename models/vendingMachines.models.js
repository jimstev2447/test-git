const db = require("../db/connection");

module.exports.fetchVendingMachines = () => {
  return db.query("SELECT * FROM vending_machines").then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchVendingMachineById = (vend_id) => {
  return db
    .query(
      `SELECT * FROM vending_machines 
                   WHERE vending_machine_id = $1`,
      [vend_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Not Found" });
      }

      return rows[0];
    });
};

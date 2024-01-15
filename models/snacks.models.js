const db = require("../db/connection");

module.exports.fetchSnacks = () => {
  return db.query("SELECT * FROM snacks").then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchSnackById = (snack_id) => {
  return db
    .query("SELECT * FROM snacks WHERE snack_id = $1", [snack_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Not Found" });
      }
      return rows[0];
    });
};

module.exports.insertSnack = (snack) => {
  return db
    .query(
      `
    INSERT INTO snacks
    (snack_name, snack_description, price_in_pence, category_id)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *`,
      [
        snack.snack_name,
        snack.description,
        snack.price_in_pence,
        snack.category_id,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

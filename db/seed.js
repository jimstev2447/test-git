const connection = require("./connection");
const format = require("pg-format");
const vendingMachineData = require("./data/vendingMachines.json");
const categories = require("./data/categories.json");
const snacks = require("./data/snacks.json");
const formatSnacks = require("./utils");

function seed() {
  return connection
    .query("DROP TABLE IF EXISTS vending_machines_snacks")
    .then(() => {
      return connection.query("DROP TABLE IF EXISTS snacks");
    })
    .then(() => {
      return connection.query("DROP TABLE IF EXISTS categories");
    })
    .then(() => {
      return connection.query("DROP TABLE IF EXISTS vending_machines");
    })
    .then(() => {
      const vendingMachinesPromise = connection.query(`
        CREATE TABLE vending_machines (
        vending_machine_id SERIAL PRIMARY KEY,
        v_location VARCHAR(58) NOT NULL,
        date_last_stocked DATE
    );`);
      const categoriesPromise = connection.query(`
      CREATE TABLE categories (
        category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(40)
    );
      `);
      return Promise.all([vendingMachinesPromise, categoriesPromise]);
    })
    .then(() => {
      return connection.query(`
        CREATE TABLE snacks (
            snack_id SERIAL PRIMARY KEY,
            snack_name VARCHAR(40),
            snack_description TEXT,
            price_in_pence INT,
            category_id INT NOT NULL,
            FOREIGN KEY (category_id)
                REFERENCES categories(category_id)
        );
        `);
    })
    .then(() => {
      return connection.query(`
        CREATE TABLE vending_machines_snacks (
            vend_snack_id SERIAL PRIMARY KEY,
            vend_id INT REFERENCES vending_machines(vending_machine_id),
            snack_id INT REFERENCES snacks(snack_id)
        );
        `);
    })
    .then(() => {
      const sqlQuery = format(
        `
        INSERT INTO vending_machines
          (v_location, date_last_stocked)
          VALUES
          %L
        `,
        vendingMachineData.map((vendingMachine) => {
          return [vendingMachine.location, vendingMachine.date_last_stocked];
        })
      );
      return connection.query(sqlQuery);
    })
    .then(() => {
      const sqlQuery = format(
        `
        INSERT INTO categories
            (category_name)
        VALUES
            %L
        RETURNING *
        `,
        categories.map((cat) => {
          return [cat.category_name];
        })
      );
      return connection.query(sqlQuery);
    })
    .then((data) => {
      const { rows: categories } = data;
      const formattedSnacks = formatSnacks(categories, snacks);
      const sqlQuery = format(
        `INSERT INTO snacks
      (snack_name, snack_description, price_in_pence, category_id)
      VALUES %L
      RETURNING *`,
        formattedSnacks
      );
      return Promise.all([
        connection.query(sqlQuery),
        connection.query("SELECT * FROM vending_machines"),
      ]);
    })
    .then(([{ rows: snacks }, { rows: vendingMachines }]) => {
      const formattedVendSnacks = vendingMachineData.reduce(
        (vendSnacks, vendData) => {
          const { vending_machine_id } = vendingMachines.find((v) => {
            return v.v_location === vendData.location;
          });

          const toAdd = vendData.snacks.map((snackName) => {
            const { snack_id } = snacks.find((snack) => {
              return snack.snack_name === snackName;
            });
            return [vending_machine_id, snack_id];
          });

          return [...vendSnacks, ...toAdd];
        },
        []
      );
      const sqlQuery = format(
        `INSERT INTO vending_machines_snacks
            (vend_id, snack_id)
        VALUES
            %L`,
        formattedVendSnacks
      );
      return connection.query(sqlQuery);
    });
}

module.exports = seed;

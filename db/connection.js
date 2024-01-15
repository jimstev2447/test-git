const { Pool } = require("pg");

if (process.env.PGDATABASE === undefined) {
  throw new Error("no PGDATABASE set!");
}
const pool = new Pool();

module.exports = pool;

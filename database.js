require("dotenv").config()
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PW,
    host: "localhost",
    port: 5432,
    database: "TMBFit"
});

module.exports = pool;
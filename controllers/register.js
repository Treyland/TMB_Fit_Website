/* const bcrypt = require("bcrypt");
const pool = require("../database");

//const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtGenerator = require("../utils/jwtgenerator")

//Registration Function
exports.register = async (req, res) => {
  // 1. Destructure req.body
    const { name, email, password } = req.body;
    try {
  // 2. Check if user exists
    const data = await pool.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    if (data.rows.length !== 0) {
      return res.status(400).json({
        error: "Email already in use.",
      });
      }
  // 3. hash user's password
      const hash = bcrypt.hash(password, 10);
       
    // 4. insert data into database
      const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [name, email, hash]);
  
    // 5. Generate JWT token
      const token = jwtGenerator(newUser.rows[0].id)
      res.json({ token });
          
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error")
    };
  }; */
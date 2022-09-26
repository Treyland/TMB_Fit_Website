/* const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const { renderFile } = require("ejs");
const jwtGenerator = require("../utils/jwtgenerator");

const app = (express());

//Login Function
exports.login = async (req, res) => {
    //1. Destructure req.body
    const { email, password } = req.body;
    try {
    //2. Check if user doesn't exist
    const user = await pool.query(`SELECT * FROM users WHERE email= $1;`, [email])
    if (user.rows.length === 0) {
        res.status(400).json({
        error: "User is not registered, Sign Up First",
            });
        }
    //3. Compare hashed password w/ user's password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(401).json("Password or Email is incorrect");
      }
    //4. Give JWT Token
    const token = jwtGenerator(user.rows[0].id);
    res.json(token);
    //res.redirect('/'); 
    } catch (err) {
        console.log(err);
        res.statuts(500).json({
        error: "Database error occured while signing in!",
        });
      };
    };
 */
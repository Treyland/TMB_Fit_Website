if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pool = require("./database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("./routes/user");
const authorization = require("./Middleware/Authorization");
const validInfo = require("./Middleware/ValidInfo");


//Middleware
app.use(express.urlencoded({ extended: false}))
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/Client/Styles/'));
app.use(express.static(__dirname + '/Client/Images/'));
app.use(express.static(__dirname + '/Client/JS/'));
app.use(cookieParser());
app.use("/users", user); //Route for /user endpoint of API

//Home Page Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Client/Home.html')
})

//About Page Routes
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/Client/About.html')
})

//Programs Page Routes
app.get('/programs', (req, res) => {
  res.sendFile(__dirname + '/Client/Program.html')
})

//Profile Page Routes
app.get('/profile', authorization, async (req, res) => {
  //verify JWT token to access profile page
  try {
  res.sendFile(__dirname + '/Client/Profile.html');
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  };
});

//Register Page Route
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/Client/Register.html')
})

//Login Page Route
app.get('/login', (req, res) => {
  if(req.cookies.access_token) {
    res.redirect('/profile');
} else {
  res.sendFile(__dirname + '/Client/Login.html')}
})

app.get('/users', async (req, res) => {
  try{
  const allUsers = await pool.query("SELECT * FROM users");
  res.json(allUsers.rows);
} catch (err) {
    console.error(err.message);
}
});

//Logout Route
app.get("/logout", authorization, (req, res) => {
  return res
  .clearCookie("access_token")
  .status(200)
  .json({ message: "Successfully logged out" });
});

//Get Data from JW Route -Test(protected)
app.get("/protected", authorization, async (req, res) => {
  try { 
    const userInfo = await pool.query(`SELECT * FROM users WHERE id = $1`, [res.user])
    res.json(userInfo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get All program Data
app.get('/programdata', async (req, res) => {
  const allPrograms = await pool.query("SELECT * from programs");
  res.json(allPrograms.rows);
})

//editName Route
app.post('/users/editName', validInfo, authorization, async (req, res) => {
  try {
    const editName = await pool.query('UPDATE users SET name = $1 WHERE id = $2', [req.body.name, res.user]);
  } catch (err) {
    console.error(err.message);
  }
});

//editEmail Route
app.post('/users/editEmail', validInfo, authorization, async (req, res) => {
  try {
    const editEmail = await pool.query('UPDATE users SET email = $1 WHERE id = $2', [req.body.email, res.user]);
  } catch (err) {
    console.error(err.message);
  }
});


app.listen(3000);
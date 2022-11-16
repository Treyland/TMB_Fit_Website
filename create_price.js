require('dotenv').config();

//set secret key - CHANGE TO LIVE IN PRODUCTION 
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);

//create product and price 
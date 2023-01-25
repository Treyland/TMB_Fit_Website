if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bodyParser = require('body-parser');
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
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");


// Find endpoint's secret in Dashboard's webhook settings
const endpointSecret = process.env.ENDPOINT_SECRET;

//Middleware
app.use(express.urlencoded({ extended: false}))
app.use(cors());
app.use(express.static(__dirname + '/Client/'));
app.use(cookieParser());
app.use("/users", user); //Route for /user endpoint of API
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

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
});

//Login Page Route
app.get('/login', (req, res) => {
  if(req.cookies.access_token) {
    res.redirect('/profile');
} else {
  res.sendFile(__dirname + '/Client/Login.html')}
});

app.get('/users', async (req, res) => {
  try{
  const allUsers = await pool.query("SELECT * FROM users");
  res.json(allUsers.rows);
} catch (err) {
    console.error(err.message);
}
});

//get beginner program page
app.get('/programs/Beginner', async (req, res) => {
  res.sendFile(__dirname + '/Client/Beginner.html')
});

//get intermediate program page
app.get('/programs/Intermediate', async (req, res) => {
  res.sendFile(__dirname + '/Client/Intermediate.html')
});

//get advanced program page
app.get('/programs/Advanced', async (req, res) => {
  res.sendFile(__dirname + '/Client/Advanced.html')
});

//get Custom program page
app.get('/programs/Custom', async (req, res) => {
  res.sendFile(__dirname + '/Client/Custom.html')
});

//Logout Route
app.get("/logout", authorization, (req, res) => {
  return res
  .clearCookie("access_token")
  .redirect('/login')
  //.json({ message: "Successfully logged out" });
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

//Get All program Data except custom 
app.get('/programdata_notcustom', async (req, res) => {
  const allPrograms = await pool.query("SELECT * from programs WHERE programname != 'Custom'")
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

//protected program data route
app.get('/protectedProgramdata', authorization, async (req, res) => {
  const allPrograms = await pool.query("SELECT * from programs");
  res.json(allPrograms.rows);
});

//get Programs a user owns
app.get('/user_programs', authorization, async (req, res) => {
  try{
  const myOrders = await pool.query('SELECT * from programs INNER JOIN orders ON programs.stripe_price_key = orders.programid WHERE orders.userid = $1', [res.user]);
  res.json(myOrders.rows)  
} catch (err) {
    console.error(err.message);
  }
});


//Create Stripe checkout route
app.post('/create-checkout-session', authorization, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map(item => {
        return {
          price:  `${item.price}`,
          quantity: item.quantity,
        }
    }),
      metadata: {
      'user_id': `${res.user}`
     },
      mode: 'payment',
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url:`${process.env.SERVER_URL}/cancel.html`
    })
    res.json({url: session.url});
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

//Stripe Webhook
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
     // On error, log and return the error message
     console.log(`❌ Error message: ${err.message}`);
     return res.status(400).send(`Webhook Error: ${err.message}`);
  }

   // Successfully constructed event
   console.log('✅ Success:', event.id);

   if(event.type === "checkout.session.completed") {
      //console.log(event.data.object.customer_details.email);

      //1. Retreive Session
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ['line_items.data'],
        }
      );
      //console.log(session);
      const items = session.line_items.data.map((item) => {
        return item.price.id;
      });
      console.log(items[0]);

      const custom = session.line_items.data.map((item) => {
        return item.description
      })
      console.log(custom[0]);

      const userID = session.metadata.user_id
      console.log(userID);

  
     /*  console.log(`
        Items purchased: ${items}
        Total amount: ${session.amount_total}
      `); */

      //2. get product link based on stripe_price_key
       
  let productLink;
  const setPLink = (rows) => {
    productLink = rows;
    console.log(productLink);
  }
      function getLink (callback) { 
        pool.query('SELECT link from programs WHERE stripe_price_key = $1', [items[0]], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        //console.log(result.rows[0].link);
       let productLink = result.rows[0].link;
       setPLink(productLink);
       //console.log(productLink);
       callback();
      })
    }

       //3. send email to customer with product
      function sendEmailNormal () {
       let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    
      // send mail with defined transport object
       transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: event.data.object.customer_details.email, // list of receivers
        subject: "Thank You For Your Purchase from TMB Fit", // Subject line
        text: "Thank you for purchasing your product!", // plain text body
        html: `
          Hello ${event.data.object.customer_details.email}, thank you for your payment for your TMB Fit Program!
          Here is the link for your new program!: ${productLink}
        `, // html body
      }); 
    }
    
    //Email for Custom Program
    function sendEmailCustom () {
      let transporter = nodemailer.createTransport({
       host: "smtp.gmail.com",
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
       },
     });
   
     // send mail with defined transport object
      transporter.sendMail({
       from: process.env.EMAIL_USER, // sender address
       to: `${event.data.object.customer_details.email}, ${process.env.EMAIL_USER}`,// list of receivers
       subject: "Thank You For Your Purchase from TMB Fit", // Subject line
       text: "Thank you for purchasing your custom program!", // plain text body
       html: `
         Hello ${event.data.object.customer_details.email}, thank you for purchasing your custom program and congrats on taking your first step!
         You will receive an email from a trainer in order to set up your consultation meeting!
       `, // html body
     }); 
   }

   //UPDATE DATABASE function
    function updateDB () {
      pool.query('INSERT INTO orders (ordernumber, userid, customerid, programid) VALUES ($1, $2, $3, $4);', [session.payment_intent, userID, session.customer, items[0]]);
   } 
   updateDB();
   
   //FULFILL ORDER
    if(custom[0] === 'Custom Program') {
      sendEmailCustom();
    } else {
      getLink(sendEmailNormal);
    }

   
   // Return a response to acknowledge receipt of the event
   res.json({received: true});

  res.status(200).end();
}
});

app.listen(3000);
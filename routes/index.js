var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const bodyParser = require('body-parser');
const { ManagementClient } = require('auth0');
const dotenv = require('dotenv');
var request = require("request");
const axios = require("axios");


// Load environment variables from .env file
dotenv.config();

// Configure the Auth0 client
const auth0 = new ManagementClient({
  domain: 'dev-6w1a8dgnwl0csby5.us.auth0.com',
  clientId: 'zvs6T4LnAVD7x8o2UdA0muwE1osYNjAX',
  clientSecret: 'Q3o2-0J1KuSperPWkZFEhJSOJno4WRjM3CwJFI9AuS0UeEtEPZBJtHJRjvU3tWiK',
});

router.get('/', requiresAuth(), function (req, res, next) {
  
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

router.get('/register', function (req, res, next) {
  console.log('Is authenticated:', req.oidc.isAuthenticated());
  res.render('register');
});

router.post('/login-user', (req, res) => {
  const { email, password } = req.body;

  
  db.get('SELECT * FROM users WHERE email = ?', email, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.locals.isAuthenticated = true;
    return res.status(200).json({ message: 'logged in' });
  });
});


router.post('/register/api', async (req, res) => {
  const {
    username,
    email,
    password,
    firstn,
    middlen,
    lastn,
    bdate,
    bplace,
    address,
    zipcode,
    contact,
  } = req.body;


  var request = require("request");

  var options = { method: 'POST',
    url: 'https://dev-6w1a8dgnwl0csby5.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"zvs6T4LnAVD7x8o2UdA0muwE1osYNjAX","client_secret":"Q3o2-0J1KuSperPWkZFEhJSOJno4WRjM3CwJFI9AuS0UeEtEPZBJtHJRjvU3tWiK","audience":"https://dev-6w1a8dgnwl0csby5.us.auth0.com/api/v2/","grant_type":"client_credentials"}' };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);

    
    const { access_token } = JSON.parse(body);
    console.log(access_token);

    const createUserOptions = {
      method: 'POST',
      url: 'https://dev-6w1a8dgnwl0csby5.us.auth0.com/api/v2/users',
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      data: {
        email,
        password,
        user_metadata: {
          username,
          firstn,
          middlen,
          lastn,
          bdate,
          bplace,
          address,
          zipcode,
          contact,
        },
        connection: "Username-Password-Authentication"
      },
    };

    try {
      const response = await axios(createUserOptions);
      console.log('User registered with Auth0:', response.data);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Error registering user with Auth0:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  });

 

  

    
    

});



module.exports = router;

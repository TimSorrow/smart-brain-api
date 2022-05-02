const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const { ssl } = require('pg/lib/defaults');
const parse = require("pg-connection-string").parse;


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const pgconfig = parse(process.env.DATABASE_URL);
pgconfig.ssl = { rejectUnauthorized: false };

const db = knex({
	// connect to your own database here:
	client: 'pg',
	connection: pgconfig
  });

const app = express();

module.exports = db;

app.use(cors())
app.use(express.json()); 

app.get('/', (req, res)=> { res.send('it is working'); })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})
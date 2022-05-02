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

import knex, { Config } from "knex";
import knexStringcase from "knex-stringcase";
import { db, isDev } from "../config";


//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//const db = knex({
	// connect to your own database here:
//	client: 'pg',
//	connection:  {
//		connectionString : process.env.DATABASE_URL,
//		ssl: false
//	  }
//  });

const config = knexStringcase({
	debug: isDev,
	client: "pg",
	connection: {
	  connectionString: db,
	  ssl: {
		rejectUnauthorized: false,
	  },
	},
	searchPath: ["public"],
	// pool: isDev ? { max: 4 } : { min: 4 },
	asyncStackTraces: true,
  } as Config) as Config;
  



const app = express();

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

export default knex(config);
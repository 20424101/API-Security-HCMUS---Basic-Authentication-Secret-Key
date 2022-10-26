import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

// import {createToken} from './helpers/token.js';
import secretKeyAuth from './middlewares/secretKeyAuth.mdw.js';

import basicAuth from './middlewares/basicAuth.mdw.js';

import accessToken_refeshToken from './middlewares/accessToken&refressToken.mdw.js'
import crypto from 'crypto';



import stackify from 'stackify-logger';

import {logError, logInfo} from './utils/log.js';

import filmRouter from './routes/film.route.js';
import actorRouter from './routes/actor.route.js';

const app = express();

stackify.start({apiKey: '0Ka5Gv6Mj6Wc4Oa6Dz2Rn9Mj5Qd7Fn7Rf1Ue9Sv', appName: 'Node Application', env: 'Production'});

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//BASIC AUTHENTICATION
// app.use(basicAuth);

//SECRET KEY
// app.use(secretKeyAuth);

//ACCESS TOKEN & REFESH TOKEN
app.use(accessToken_refeshToken);
//------------------------------
app.post('/api/auth', function (req, res) {
  const time = Date.now() + 60000; // 1 phut
  // console.log(time);
  const user = req.body.username;
  const secret_key = process.env.SECRET_KEY;

  const payload = `${user}#${time}`;
  const hash = crypto.createHash('sha256')
  .update(payload+secret_key)
  .digest('hex');

  const encode = Buffer.from(`${payload}:${hash}`).toString('base64');

  if(req.body.username !== process.env.AUTH_USER || req.body.password !== process.env.AUTH_PASSWORD){
    return res.status(403).send({authenticated: false});
  }

  res.json({
    authenticated: true,
    accessToken: encode,
    refeshToken: process.env.REFESH_TOKEN
  });
});



app.get('/', function (req, res) {
  res.json({
    msg: 'API Validation'
  });
});


app.use('/api/films', filmRouter);
app.use('/api/actors', actorRouter);

// Capture 500 errors
app.use((err, req, res, next) => {
  res.status(500).send('Could not perform the calculation!');
     logError(err, req, res);
  })
  
// Capture 404 erors
app.use((req, res, next) => {
    res.status(404).send("PAGE NOT FOUND");
    logInfo(req, res);
})

app.use(stackify.expressExceptionHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`API Security is listening at http://localhost:${PORT}`);
});
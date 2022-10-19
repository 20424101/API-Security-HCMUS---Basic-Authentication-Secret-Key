import express from 'express';
import morgan from 'morgan';

import dotenv from 'dotenv';
dotenv.config();

import {createToken} from './helpers/token.js';
import secretKeyAuth from './middlewares/secretKeyAuth.mdw.js';

import basicAuth from './middlewares/basicAuth.mdw.js';




import stackify from 'stackify-logger';

import {logError, logInfo} from './utils/log.js';

import filmRouter from './routes/film.route.js';
import actorRouter from './routes/actor.route.js';

const app = express();

stackify.start({apiKey: '0Ka5Gv6Mj6Wc4Oa6Dz2Rn9Mj5Qd7Fn7Rf1Ue9Sv', appName: 'Node Application', env: 'Production'});

app.use(express.json());
app.use(morgan('dev'));

//BASIC AUTHENTICATION
// app.use(basicAuth);

//SECRET KEY AUTHENTICATION
app.use(secretKeyAuth);

app.get('/', function (req, res) {
  res.json({
    msg: 'API Validation'
  });
});

app.post('/api/auth_secret_key', function (req, res) {
  if(!req.body.url)
    res.status(403).send({message: 'Forbidden'});

  if(req.body.username !== process.env.AUTH_USER || req.body.password !== process.env.AUTH_PASSWORD)
    res.status(403).send({message: 'Forbidden'});

  const time = Date.now();
  const url = req.body.url;
  res.json({
    time: time,
    token: createToken(time, url)
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
  console.log(`API Validation is listening at http://localhost:${PORT}`);
});
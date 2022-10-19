import express from 'express';
import {logError, logInfo} from '../utils/log.js';
import {stackifyError, stackifyInfo} from '../utils/stackify-log.js';
import { readFile } from 'fs/promises';

import filmModel from '../models/film.model.js';
import validate from '../middlewares/validate.mdw.js';

const schema = JSON.parse(await readFile(new URL('../schemas/film.json', import.meta.url)));
const router = express.Router();

router.get('/', async function (req, res) {

  // const authorization = req.headers.authorization;
  // if(!authorization){
  //   return res.status(403).send({message: 'Forbidden'});
  // }
  // //Basic QWRtaW46UHkxMjM0NTY=
  // const encoded = authorization.substring(6);
  // const decoded = Buffer.from(encoded, 'base64').toString('ascii');
  // //Admin:Py123456
  // const [username, password] = decoded.split(':');
  // const authenticatedUser = 'Admin';
  // const authenticatedPassword = 'Py123456';
  // if(username !== authenticatedUser || password !== authenticatedPassword){
  //   return res.status(403).send({message: 'Forbidden'});
  // }

  try {
    const list = await filmModel.findAll();
    res.json(list);
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
  
})

router.get('/:id', async function (req, res) {
  try{
    const id = req.params.id || 0;
    const film = await filmModel.findById(id);
    if (film === null) {
      return res.status(204).end();
    }
    res.json(film);
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

router.post('/', validate(schema), async function (req, res) {
  try{
    let film = req.body;
    const ret = await filmModel.add(film);

    film = {
      film_id: ret[0],
      ...film
    }
    res.status(201).json(film);
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

router.delete('/:id', async function (req, res) {
  try{
    const id = req.params.id || 0;
    const n = await filmModel.del(id);
    res.json({
      affected: n
    });
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
  
})

router.patch('/:id', validate(schema), async function (req, res) {
  try{
    const id = req.params.id || 0;
    const film = req.body;
    const n = await filmModel.patch(id, film);
    res.json({
      affected: n
    });
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

export default router;
import {encodedToken} from '../helpers/token.js';

export default function secretKeyAuth(req, res, next){
    if('/api/auth_secret_key' === req.originalUrl){
        next();
    }
    console.log(req.originalUrl);
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

    const time = Date.now();
    if(time - req.body.time > 600000)
        res.status(403).send({message: 'Forbidden'});
    if(!encodedToken(req, res))
        res.status(403).send({message: 'Forbidden'});
    
    next();
}
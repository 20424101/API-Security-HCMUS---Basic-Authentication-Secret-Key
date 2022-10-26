import crypto from 'crypto';

export default function secretKeyAuth(req, res, next){
    if('/api/auth' === req.originalUrl){
        next();
    }

    // console.log(req.originalUrl);
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

    //..............................CODE
    const accessToken = req.headers['x-access-token'];
    const refeshToken = req.headers['x-refesh-token'];

    const decoded = Buffer.from(accessToken, 'base64').toString('ascii');
    const [payload, hash] = decoded.split(':');
    const [user, time] = payload.split('#');
    // console.log(time);
    const current_time = Date.now();
    // console.log(current_time);

    // let effective = null;
    // time === undefined ? res.status(403).send({message: 'Forbidden'}) : effective = time > current_time;

    if(time - current_time){
        const hash_server = crypto.createHash('sha256')
        .update(payload+process.env.SECRET_KEY)
        .digest('hex');

        console.log(hash);
        console.log(hash_server);
        if(hash === hash_server){
            next();
        }
        else{
            res.status(403).send({message: 'Forbidden'});
        }
    }
    else{
        if(refeshToken === process.env.REFESH_TOKEN){
            next();
        }
        else{
            res.status(403).send({message: 'Forbidden'});
        }
    }
}
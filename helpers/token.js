import crypto from 'crypto';


export function createToken(time, url){
    
    const secret_key = process.env.SECRET_KEY;

    return crypto.createHash('sha256')
    .update(url+time+secret_key)
    .digest('hex');
}

export function encodedToken(req_url, time, token){
    // const time = req.body.time;
    const url = req_url;
    const secret_key = process.env.SECRET_KEY;

    const hash = crypto.createHash('sha256')
    .update(url+time+secret_key)
    .digest('hex');

    return hash === token;
}
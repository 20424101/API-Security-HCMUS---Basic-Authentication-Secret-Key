import stackify from 'stackify-logger';
stackify.start({apiKey: '0Ka5Gv6Mj6Wc4Oa6Dz2Rn9Mj5Qd7Fn7Rf1Ue9Sv', appName: 'Node Application', env: 'Production'});

export const stackifyError = (err, req, res) =>{
    stackify.error('Message', {anything: `${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - req.body: ${JSON.stringify(req.body)}`});
}

export const stackifyInfo = (req, res) =>{
    stackify.info('Message', {anything: `${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - req.body: ${JSON.stringify(req.body)}`});
}
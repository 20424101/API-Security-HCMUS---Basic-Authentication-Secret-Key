import {createLogger, transports, format} from 'winston';
import  'winston-daily-rotate-file';

const transport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

// const log = createLogger({
// transports:
//     new transports.File({
//     filename: `logs/${new Date().toJSON().slice(0,10).replace(/-/g,'-')}.log`,
//     format:format.combine(
//         format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
//         format.align(),
//         format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
//     )}),
// });

const log = createLogger({
    transports: [
      transport
    ]
  });



export const logError = (err, req, res) =>{
    log.error(`${new Date().toJSON()} - ${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - req.body: ${JSON.stringify(req.body)}`);
}

export const logInfo = (req, res) =>{
    log.info(`${new Date().toJSON()} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip} - req.body: ${JSON.stringify(req.body)}`);
}
// var createError = require('http-errors');
import createError from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
// var express = require('express');
import path from 'path';
import cookieParser from 'cookie-parser';
// import logger from 'morgan';

import * as routers from './routes';
import * as url from 'node:url';
import cors from 'cors';
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import session from "express-session";
import * as passportConfig from "./config/passport";

dotenv.config();

const app = express();


// app.use(logger('dev'));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(session({
  secret: process.env.SESSION_SECRET || "mysessionsecret",
  resave: true,
  saveUninitialized: true,
}))
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

passportConfig.configure(app);


// app.use('/', indexRouter);
app.use('/auth', routers.auth);
app.use('/users', routers.users);
app.use('/files', routers.files);
app.use('/folders', routers.folders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
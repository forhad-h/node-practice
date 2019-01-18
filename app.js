/* jshint esversion: 6 */
const express = require('express');
const Joi = require('joi');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')("app:debug")
const courses = require('./routes/courses');

const app = express();

app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.use('/api/courses', courses);

app.use(logger);

if( app.get('env') === 'development') {
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}

console.log(app.get('env'))
console.log("Application Name: " + config.get('name'));
console.log("Mail server: " + config.get('mail.host'));
//const mailPassword = typeof config.get('mail.password') !== 'undefined' ? config.get('mail.password') : '';
if('password' in config.get('mail')) {
  console.log("if");
  console.log(config.get('mail.password'));  
}

app.use(function(req, res, next) {
  console.log('Authenticating...');
  next();
})



const port  = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
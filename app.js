/* jshint esversion: 6 */
const express = require('express');
const Joi = require('joi');
const logger = require('./logger');
const morgan = require('morgan');
const config = require('config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))

app.use(logger)

if( app.get('env') === 'development') {
  app.use(morgan('tiny'))
  console.log('Morgan enabled...')
}
console.log(app.get('env'));

app.use(function(req, res, next) {
  console.log('Authenticating...');
  next();
})

const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'},
]
app.get('/', (req, res) => {
   res.send('Hello World')
});

app.get('/api/courses', (req, res) => {
  res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
  const course  = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) res.status(404).send('course not found');
  res.send(course);
});


app.post('/api/courses', (req, res) => {

  const schema = {
    name: Joi.string().min(3).required()
  };

  const result = Joi.validate(req.body, schema);

  if(result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let course = {
    id: courses.length + 1,
    name: req.body.name,
  }
  courses.push(course);
  res.send(course);
});


const port  = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
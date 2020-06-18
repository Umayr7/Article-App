require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config= require('./config/database')

var PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI || config.database)
let db = mongoose.connection

//Check connection
db.once('open', ()=>{
    console.log('Conencted to MongoDB');
    
})

//Check for DB errors
db.on('error', (err)=> {
    console.log(err);
    
})

//init app
const app = express()

//Models
let Article = require('./models/article')

//load view engine

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//BodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Setting public folder
app.use(express.static(path.join(__dirname,'public')))

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

app.use(flash())

//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
const { check, validationResult } = require('express-validator/check');

//Passport Config
require('./config/passport')(passport)

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Getting user if logged in
app.get('*', (req, res, next)=>{
    res.locals.user = req.user || null
    next()
})

//Home Route
app.get('/', (req, res)=> {
    Article.find({}, (err, articles)=>{
        if(err) {
            console.log(err);
        }
        else
        {
            res.render('index', {
                title: 'Articles',
                articles: articles
            }) 
        }
               
    })

})

//Route Files
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)

//start server
app.listen(PORT, ()=>{
    console.log('server started at port 3000');
    
})

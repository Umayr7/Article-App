const express = require('express')
const router =  express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
let User = require('../models/user')

// Express Validator Middleware
const { check, validationResult } = require('express-validator');

//Register Form
router.get('/register', (req, res)=> {
    res.render('register')
})

//Register Process
router.post('/register', [
    check('name', 'Name is required').isLength({min: 1}),
    check('email', 'Email is required').isLength({min: 1}),
    check('email', 'Email is not valid').isEmail(),
    check('username', 'Username is required').isLength({min: 1}),
    check('password', 'Password is required').isLength({min: 1}),
    check('password2', 'Please confirm password').custom((value, {req, loc, path}) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      } else { return value; }
    })
  ], (req, res)=> {
    
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //Get Errors
    const errors = validationResult(req)

    if(!errors.isEmpty())
    {
        res.render('register', {
            errors: errors
        })
        console.log(errors);
        
    }
    else
    {

        let user = new User({
            name: name,
            email: email,
            username: username,
            password: password,
        })       

        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash)=> {
                if(err)
                {
                    return
                }
                user.password = hash
                user.save((err)=> {
                    if(err)
                    {
                        return
                    }
                    else
                    {
                        req.flash('success', 'You are now registered and can log in!')
                        res.redirect('/users/login')
                    }
                })
            })
        })
    }
})

//Login Form
router.get('/login', (req, res)=> {
    res.render('login')
})

//Login POST
router.post('/login', (req,res, next)=>{
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next)
})

//Logout Form
router.get('/logout', (req, res)=> {
    req.logout()
    req.flash('success', 'you are logged out')
    res.redirect('/users/login')
})

module.exports = router;
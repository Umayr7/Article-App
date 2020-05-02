const express = require('express')
const router =  express.Router()
const bcrypt = require('bcryptjs')

//User Model
let User = require('../models/user')

// Express Validator Middleware
const { check, validationResult } = require('express-validator/check');

//Register Form
router.get('/register', (req, res)=> {
    res.render('register')
})

//Register Process
router.post('/register', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('username').notEmpty().withMessage('Username is required'),
    check('password').isEmpty().withMessage('Password is required'),
    check('password2').matches('password').withMessage('Passwords do not match')
], (req, res)=> {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2
    })

    //Get Errors
    const errors = validationResult(req)

    if(errors)
    {
        res.render('register', {
            errors: errors
        })
        console.log(errors);
        
    }
    else
    {
        user.name = req.body.name;
        user.email = req.body.email;
        user.username = req.body.username;
        user.password = req.body.password;
        
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

        // bcrypt.genSalt(10, (err, salt)=> {
        //     bcrypt.hash(user.password, salt, (err, hash)=> {
        //         if(err)
        //         {
        //             return
        //         }
        //         user.password = hash
        //         user.save((err)=> {
        //             if(err)
        //             {
        //                 return
        //             }
        //             else
        //             {
        //                 req.flash('success', 'You are now registered and can log in!')
        //                 res.redirect('/users/login')
        //             }
        //         })
        //     })
        // })
    }
})

router.get('/login', (req, res)=> {
    res.render('login')
})

module.exports = router;
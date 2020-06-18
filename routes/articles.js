const express = require('express')
const router =  express.Router()

//Article Model
let Article = require('../models/article')

//User Model
let User = require('../models/user')

// Express Validator Middleware
const { check, validationResult } = require('express-validator');

//Add Article Route
router.get('/add', ensureAuthenticated, (req, res)=> {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Add POST route
router.post('/add', [
    check('title').notEmpty().withMessage('Title is required'),
    // check('author').notEmpty().withMessage('Author is required'),
    check('body').notEmpty().withMessage('Body is required')
], (req, res)=> {
    let article = new Article({
        title: req.body.title,
        author: req.user._id,
        body: req.body.body
    })
    
    //Get Errors
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors.mapped()
        });
    }
    else
    {
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
    
        article.save((err)=> {
            if(err)
            {
                console.log(err);
                return
            }
            else
            {
                req.flash('success', 'Article Added')
                res.redirect('/')
            }
        })
    }

})

//Load Edit Form Route
router.get('/edit/:id', (req, res)=> {
    Article.findById(req.params.id, (err, article)=> {
        if(article.author != req.user._id)
        {
            req.flash('danger', 'Not Authorized')
            res.redirect('/')
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        })
    })
})

//Update POST route
router.post('/edit/:id', (req, res)=> {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, (err)=> {
        if(err)
        {
            console.log(err);
            return
        }
        else
        {
            req.flash('success', 'Article Updated')
            res.redirect('/')
        }
    })
})

//Deleting Article Route
router.delete('/:id', (req, res)=> {
    if(!req.user._id)
    {
        res.status(500).send()
    }

    let query = {_id:req.params.id}

    // Article.findById(req.params.id, (article)=>{
    //     if(article.author != req.user._id)
    //     {
    //         res.status(500).send()
    //     }
    //     else
    //     {
    //     }
                Article.remove(query, (err)=> {
                    if(err)
                    {
                        console.log(err);
                    }
                    res.send('Success')
                })
    // })

})

//Single Article Route
router.get('/:id', (req, res)=> {
    Article.findById(req.params.id, (err, article)=> {
        User.findById(article.author, (err, user)=>{
            res.render('article', {
                article: article,
                author: user.name
            })
        })
    })
})

//Access Control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) 
    {
        return next()
    }
    else
    {
        req.flash('danger', 'Please Login')
        res.redirect('/users/login')
    }
}

module.exports = router;

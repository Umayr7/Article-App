const express = require('express')
const router =  express.Router()

//Article Model
let Article = require('../models/article')

// Express Validator Middleware
const { check, validationResult } = require('express-validator/check');

//Add Article Route
router.get('/add', (req, res)=> {
    res.render('add_article', {
        title: 'Add Article'
    })
})

//Add POST route
router.post('/add', [
    check('title').notEmpty().withMessage('Title is required'),
    check('author').notEmpty().withMessage('Author is required'),
    check('body').notEmpty().withMessage('Body is required')
], (req, res)=> {
    let article = new Article({
        title: req.body.title,
        author: req.body.author,
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
        article.author = req.body.author;
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
    let query = {_id:req.params.id}

    Article.remove(query, (err)=> {
        if(err)
        {
            console.log(err);
        }
        res.send('Success')
    })
})

//Single Article Route
router.get('/:id', (req, res)=> {
    Article.findById(req.params.id, (err, article)=> {
        res.render('article', {
            article: article
        })
    })
})


module.exports = router;

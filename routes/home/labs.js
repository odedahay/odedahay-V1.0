const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

// Overwrite the layout
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'labs';
    next();
})

// List pages
router.get('/my-labs', (req, res) => {
    Post.find({})
        .populate('category')
        .then(posts => {
            Category.find({})
                .then(categories => {
                    res.render('home/labs', {
                        posts: posts,
                        categories: categories
                    })
                });
        })
});

// Get Detaild Page
router.get('/my-labs/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            Category.find({})
                .then(categories =>{
                    res.render('home/single', {
                        post: post,
                        categories: categories
                    });
                })
        })
});

// Get all Categories at public
router.get('/my-labs/category/:catId', (req, res) => {
    Post.find({ category: req.params.catId })
        .then(posts => {
            Category.find({})
                .then(categories => {
                    res.render('home/labs', {
                        posts: posts,
                        categories: categories
                    })
                })
        })
        .catch(err => console.log(err));
});


module.exports = router;
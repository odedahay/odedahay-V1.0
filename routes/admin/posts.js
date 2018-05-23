const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {

    Post.find({})
        .then((posts) => {
            res.render('admin/posts/posts', {
                posts: posts
            });
        })
});

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ message: 'please add a title' });
    }

    if (!req.body.body) {
        errors.push({ message: 'please add a description' });
    }


    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        })
    } else {

        let allowComments = true;

        if (req.body.allowComments) {
            allowComments = true;

        } else {
            allowComments = false;

        }

        let filename = 'BMW-Z4.jpg';

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            filename = Date.now() + '-' + file.name;

            file.mv('./public/uploads/' + filename, (err) => {

                if (err) throw err;

            });
        }

        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,

            file: filename

        });

        newPost.save()
            .then(() =>{
                req.flash('success_message', 'Post was successfully created');
                res.redirect('/admin/posts')
            })
            .catch(err => console.log(err));
    }

});

// Get Value of the  Post
router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            res.render('admin/posts/edit', {
                post: post
            })
        })
});

// Update the Post
router.put('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then((post) => {

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }


            post.title = req.body.title;
            post.status = req.body.status;
            post.body = req.body.body;

            if (!isEmpty(req.files)) {

                let file = req.files.file;
                filename = Date.now() + '-' + file.name;
                post.file = filename;

                file.mv('./public/uploads/' + filename, (err) => {

                    if (err) throw err;

                });

            }

            post.save().then(updatedPost => {
                req.flash('success_message', 'Post was successfully updated');
                res.redirect('/admin/posts');
            })
        });
});

// Update the Post

router.delete('/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then( post => {

            fs.unlink(uploadDir + post.file, (err) => {

                post.remove().then(postRemoved => {
                    req.flash('success_message', 'Post was successfully deleted');
                    res.redirect('/admin/posts');
                });
            });
        });
});

module.exports = router;
const express = require('express');
const router = express.Router();

const Category = require('../../models/Category');
const Post = require('../../models/Post');

// To ensure layout of Admin
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    Category.find({})
        .then(categories => {
            res.render('admin/categories/index', {
                categories: categories
            });
        })

});

router.post('/create', (req, res) => {
    const newCategory = new Category({
        name: req.body.name
    });

    newCategory.save(saveCategory => {
        res.redirect('/admin/categories');
    });

});

// Edit Category
router.get('/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id })
        .then(category => {
            res.render('admin/categories/edit', {
                category: category
            });
        })
});

// Update Category
router.put('/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id })
        .then(category => {
            category.name = req.body.name;
            category.save()
                .then(savedCategory => {
                    req.flash('success_message', 'Category was successfully updated');
                    res.redirect('/admin/categories')
                })
        })
});

// Delete Category
router.delete('/:id', (req, res) => {
    Category.remove({ _id: req.params.id })
        .then(result => {
            req.flash('success_message', 'Categogry was successfully deleted');
            res.redirect('/admin/categories');
        })
});

// Get all Categories 
router.get('/:catId', (req, res) => {
    Post.find({ category: req.params.catId })
        .populate('category')
        .then(posts => {
            Category.findOne({ id: req.params.id })
                .then(category => {
                    res.render('admin/posts/categories', {
                        posts: posts,
                        category: category
                    })
                })
        })
        .catch(err => console.log(err));
});


module.exports = router;
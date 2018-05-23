const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin_pre';
    next();
})

// Login 
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Register
router.get('/register', (req, res) => {
    res.render('admin/register');
});


module.exports = router;
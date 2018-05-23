const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'labs';
    next();
})

router.get('/labs', (req, res) => {
    res.render('home/labs');
});


module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

const database = require('./config/database').mongoDbUrl

mongoose.connect(database)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();

// Using static
app.use(express.static(path.join(__dirname, 'public')));


const { select, generateDate } = require('./helpers/handlebars-helpers');
// Set view engine
app.engine('handlebars', exphbs({ defaultLayout: 'home', helpers: { select: select, generateDate: generateDate } }));
app.set('view engine', 'handlebars');

app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

// Session
app.use(session({
    secret: 'rodeliodahayilovecoding',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());


// Local Variables using Middleware
app.use((req, res, next) => {

    // res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    
    next();

});

//Load Routes
const home = require('./routes/home/index');
const labs = require('./routes/home/labs');

const login = require('./routes/admin/dashboard_pre');
const admin = require('./routes/admin/dashboard');

const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');

// Use Routes
app.use('/', home);
app.use('/', labs); //active menu nav will works!

app.use('/admin', login);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
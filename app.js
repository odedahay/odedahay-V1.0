const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const database = require('./config/database').mongoDbUrl

mongoose.connect(database)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();


// Using static
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Load Routes
const home = require('./routes/home/index');

// Use Routes
app.use('/', home);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
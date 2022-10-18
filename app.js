if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
    
}

const express = require('express');
//Session Management
const session = require('express-session');
const  flash = require('connect-flash');
const path = require('path');

const mongoose = require('mongoose');

const MongoDBStore = require("connect-mongo");

const ejsMate = require('ejs-mate');
const methotOverride = require('method-override');
const { photospotSchema, reviewSchema } = require('./schemas.js');
//Prevent mongoDB expressions send via Browser
const mongoSanitize = require('express-mongo-sanitize');
//Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");
//User Authentication Gelöt
const passport = require('passport');
const LocalStategy = require('passport-local');
const User = require('./models/user');

//Importing routes
const userRoutes  = require('./routes/users');
const photospotsRoutes = require('./routes/photospots');
const reviewsRoutes  = require('./routes/reviews');

// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/photo-spot';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Check if Database is running
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database is up and connected");
});

// Start essential stuff
const app = express();

//** Only for development **//
const morgan = require('morgan');
const Joi = require('joi');
const { findByIdAndDelete } = require('./models/review');
app.use(morgan('tiny'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'))

const secret = process.env.SECRET || 'devsecret';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

store.on("error", function(e){
console.log(`Store Error! Error Log:${e}`)
});

//Setting up the Session Management
const sessionConfig = {
    store,
    name: 'istilloveher',
    secret,
    resave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 *60 * 60 * 24 * 7,
        maxAge: 1000 *60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(session(sessionConfig));
//Flash for Messages
app.use(flash());

app.use(express.urlencoded({ extended: true }));
//Use method override to override a POST request in a from
//e.g. /photospots/<%= photospot._id %>?_method=PUT
app.use(methotOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
//Passport Initialisation
app.use(passport.initialize());
app.use(passport.session());
//Security 
app.use(mongoSanitize());

//Helmet Content Security Setup
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dafnwxfuh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dafnwxfuh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dafnwxfuh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dafnwxfuh/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dafnwxfuh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dafnwxfuh/" ],
            childSrc   : [ "blob:" ]
        }
    })
);
 
//Passport configuration
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Creating Flash Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Mount the routes
app.use('/' , userRoutes);
app.use('/photospots', photospotsRoutes );
app.use('/photospots/:id/reviews', reviewsRoutes );


//From here we setup our routes
app.get('/', (req, res) => {
    res.render('home');
})

// Basic Error Handling (and the end of the AsyncErrorHandler function)
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    //Error Page is only good for Development
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})


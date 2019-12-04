require('dotenv').config()
var express             = require ("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Treatment           = require("./models/treatment"),
    Review              = require("./models/review"),
    User                = require("./models/user"),
    seedDB              = require("./seeds")
    app.locals.moment   = require('moment');


//requiring Routes
var reviewRoutes    = require("./routes/reviews"),
    treatmentRoutes = require("./routes/treatments"),
    indexRoutes     = require("./routes/index")

//Connect Db
mongoose.connect('mongodb+srv://devUser:devpw123@cluster0-snvsz.mongodb.net/WellnessApp?retryWrites=true&w=majority', {
    useUnifiedTopology  :true,
    useNewUrlParser     :true,
    useCreateIndex      :true
    })  
        .then(() => console.log('>>Database Connected'))
        .catch(err => console.log('Database connection error: ${err.message}'));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //removing.ejs  for readable code
app.use(express.static(__dirname + "/public"));
app.use(express.static("views"));
app.use(methodOverride("_method"));
app.use(flash());

//SEED the Db  //seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "this is no secret, i like big boats.",
    resave: false, 
    saveUninitialized: false
}));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




app.use("/", indexRoutes);
app.use("/treatments",treatmentRoutes);
app.use("/treatments/:id/reviews", reviewRoutes);


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log(">>Server Booted!");
    
});

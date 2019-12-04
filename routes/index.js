
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Treatment = require("../models/treatment");


//==========
//GENERAL ROUTES
//==========
    //Root route
    router.get("/", function(req, res){
    res.render("landing");
    console.log("A Customer has viewed the Homepage");
});
 //Root route
 router.get("/contact", function(req, res){
    res.render("contact");
    console.log("A user is checking your contact info...!");
});
    //Root route
router.get("/opening", function(req, res){
    res.render("opening");
    console.log("Someone is checking your Opening Hrs!");
});
router.get("/location", function(req, res){
    res.render("location");
    console.log("Someone is checking where you live!");
});


     

   
//=============
//AUTH ROUTES
//=============

//SHOW register form
router.get("/register", function(req,res){
    res.render("register");
    console.log("a possible NEW customer")
});

 
//handle register logic
router.post("/register", function(req, res){
    //create user model
   var newUser =  new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar,
    });

    //env var
   if(req.body.adminCode === process.env.ADMIN_CODE){
       newUser.isAdmin = true;
   } 
    User.register( newUser, req.body.password, function(err, user){
        if(err){
            //if a username already exists
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Your Wellness App " + user.firstName);
            res.redirect("/treatments");
        });
    });
});


//SHOW login form
router.get("/login", function(req, res){
    res.render("login");
});



//HANDLE lOGIN LOGIC 
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/treatments",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back to Your Wellness App!"
    }), function(req, res){
});


//Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully been logged out");
    res.redirect("/treatments");
});


//User Profile

router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("/");
        } 
        Treatment.find().where('author.id').equals(foundUser._id).exec(function(err, treatments){
            if(err){
                req.flash("error","Something went wrong!");       
        }
        res.render("users/show", {user: foundUser, treatments: treatments});
    })
    });
});


  

module.exports = router;


// ALL MIDDLEWARE GOES HERE
var Treatment = require("../models/treatment");
var Review = require("../models/review");

// all the middleare goes here
var middlewareObj = {};


// CHECK TREATMENT CREATOR
middlewareObj.checkTreatmentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
    Treatment.findById(req.params.id, function(err, foundTreatment){
            if(err){
                req.flash("error","Treatment not found");
                res.redirect("back");
            } else {
                //does user own treatment
                if(foundTreatment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next(); 
                } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
                }   
            }
        }); 
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
        }
}

    
// CHECK REVIEW CREATOR
middlewareObj.checkReviewOwnership = function(req, res, next) {
if(req.isAuthenticated()){

    Review.findById(req.params.review_id, function(err, foundReview){
        if(err || !foundReview){
            req.flash("error", "Treatment not found");
            res.redirect("back");
        } else {
            //does user own treatment
            if(foundReview.author.id.equals(req.user._id) ||  req.user.isAdmin) {
                next(); 
            } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
            }   
        }
    }); 
} else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
    }
}


//CHECK USER IS LOGGED IN
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}




module.exports = middlewareObj;
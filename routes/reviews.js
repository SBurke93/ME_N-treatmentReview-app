var express = require("express");
var router = express.Router({mergeParams: true});
var Treatment = require("../models/treatment");
var Review = require("../models/review");
var middleware = require("../middleware");

//=====================
// REVIEWS ROUTES 
// ====================

// NEW - Review
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find treatment by id
    console.log("User:", req.params.id);
    Treatment.findById(req.params.id, function(err, treatment){
        if(err){
            console.log(err);
        } else {
            res.render("reviews/new", {treatment: treatment});
        }
    });
});


// CREATE - Review
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup treatment using id
    Treatment.findById(req.params.id, function(err, treatment){
        if(err){
            console.log(err);
            res.redirect("/treatments")
        } else {
            Review.create(req.body.review, function(err, review){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to review
                    review.author.id = req.user._id;
                    review.author.username = req.user.username;
                    //save review
                    review.save();
                    treatment.reviews.push(review);
                    treatment.save();
                    console.log(review);
                    req.flash("success", "Successfully Created");
                    res.redirect('/treatments/' + treatment._id);
                }
            });
        }
    });
});


// EDIT - Review
router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res){
    Treatment.findById(req.params.id, function(err, foundTreatment){
        if(err || !foundTreatment) {
            req.flash("error", "No Treatment found");
            return res.redirect("back");
        }
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err){
                res.redirect("back");
            } else {
                res.render("reviews/edit", {treatment_id: req.params.id, review: foundReview});
            }
        });
    });
    
});    


// UPDATE - Reviews
router.put("/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/treatments/" + req.params.id);
        }
    }); 
});


// DESTROY - Review
router.delete("/:review_id", middleware.checkReviewOwnership, function(req, res){
    //findByIdAndRemove
    Review.findByIdAndRemove(req.params.review_id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }else {
            req.flash("error", "Review Deleted");
            res.redirect("/treatments/" + req.params.id);
        }
    });
});

module.exports = router;
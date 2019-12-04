var express = require("express");
var router = express.Router();
var Treatment = require("../models/treatment");
var middleware = require("../middleware");


// INDEX  - show all Treatments
router.get("/", function(req, res){
var noMatch = null;
if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //GET ALLtreatments from DB
    Treatment.find({name: regex}, function(err, allTreatments){
        if(err){ 
            console.log(err);
        } else {
            if(allTreatments.length < 1) {
                noMatch = "No Treatments match that query, please try again.";
            }
            res.render("treatments/index",{treatments:allTreatments, noMatch: noMatch});
        }
    });
} else {
    //GET ALLtreatments from DB
        Treatment.find({}, function(err, allTreatments){
            if(err){ 
                console.log(err);
            } else {
                res.render("treatments/index",{treatments:allTreatments, noMatch: noMatch});
            }
        });
    }
});


// CREATE  -  add new Treatment to DB 
router.post("/",middleware.isLoggedIn,  function(req, res){
    //get data from form and add to treatment array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTreatment = {name: name, image: image, description: desc, author: author}
    // create a new treatment and save to DB
    Treatment.create(newTreatment, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // re-direct back to the treatments page
            console.log(newlyCreated);
            req.flash("success", "Created New Treatment" );
            res.redirect("/treatments");
        }
    });

});



// NEW  -  show form to create new Treatment
router.get("/new",middleware.isLoggedIn, function(req, res){
   
    res.render("treatments/new");
});


// SHOW  -  shows more data on specific Treatment
router.get("/:id", function(req, res){
    //find the treatment with provided id
    Treatment.findById(req.params.id).populate("reviews").exec(function(err, foundTreatment){
        if(err || !foundTreatment){
            req.flash("error", "Treatment not found");
            res.redirect("back");
        } else {
            console.log(foundTreatment);
            //render show template with related treatment
             res.render("treatments/show", {treatment: foundTreatment}); 
        }
    });
});




// EDIT Treatment route
router.get("/:id/edit",middleware.checkTreatmentOwnership, function (req, res){
            Treatment.findById(req.params.id, function(err, foundTreatment){    
                    res.render("treatments/edit", {treatment: foundTreatment});
            });  
});



// UPDATE - Treatment route
router.put("/:id",middleware.checkTreatmentOwnership, function(req, res){
    //Find and update correct treatment
    Treatment.findByIdAndUpdate(req.params.id, req.body.treatment, function(err, updatedTreatment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/treatments/" + req.params.id);
        }
    }); 
});


//DESTROY - Treatment route
router.delete("/:id",middleware.checkTreatmentOwnership, function(req, res){
    Treatment.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/treatments");
        } else {
            req.flash("success", "Successfully Deleted!");
            res.redirect("/treatments");
            console.log("Treatment Delete Successful");
        }
    });

});





//https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
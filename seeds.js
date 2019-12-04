var mongoose    = require("mongoose");
var Treatment   = require("./models/treatment");
var Review     = require("./models/review");
 
var data = [   
    {
        name: "Reiki", 
        image: "https://images.pexels.com/photos/1548091/pexels-photo-1548091.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        benefits: "Aids better sleep, Helps relieve pain, Reduces blood pressure",
        cat: "Holistic",
        description: "Reiki treats the whole person including body, emotions, mind and spirit creating many beneficial effects that include relaxation and feeling of peace, security and wellbeing."

    },
    {
        name: "Aromatherapy Massage", 
        image: "https://images.pexels.com/photos/161599/scent-sticks-fragrance-aromatic-161599.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
        benefits: "stress and anxiety control,relaxation of tired and stressed minds, improvement of blood circulation,",
        cat: "Holistic",
        description: "This is the use of a gentle massage combined with essential oils to reduce stress, rejuvenate the body and provide an all-round pleasant experience for the client."
    },
    {
        name: "Sweedish Massage", 
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        benefits: "Improve joint mobility, Improve circulation, Reduce muscular pain or tension",
        cat: "Massage",
        description: "This treatment combines a range of massage movements to your desired pressure from your toes to your scalp."
    },
    {
        name: "Indian Head Massage", 
        image: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        benefits: "Aids better sleep, Helps relieve pain, Reduces blood pressure",
        cat: "Massage",
        description: "This technique uses a range of different massage pressures and rhythms to stimulate the soft tissues in the shoulders and scalp to help relieve strain and tension."
    }
]
 
function seedDB(){
   //Remove all treatments
   Treatment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed treatments!");
        Review.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed reviews!");
             //add treatments
            data.forEach(function(seed){
                Treatment.create(seed, function(err, treatment){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a treatment");
                        //create a review
                        Review.create(
                            {
                                text: "One of the best experiences I've had, totally relaxed!!",
                                author: "Mary"
                            }, function(err, review){
                                if(err){
                                    console.log(err);
                                } else {
                                    treatment.reviews.push(review);
                                    treatment.save();
                                    console.log("Created new review");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;
var mongoose    = require("mongoose");

var treatmentSchema = new mongoose.Schema({
    name:   String,
    image:  String,
    price:  String,
    benefits: String,
    cat:  String,
    description: String,
    createdAt: { type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


module.exports  = mongoose.model("Treatment", treatmentSchema);
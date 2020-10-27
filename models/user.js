const mongoose = require("mongoose");
const{ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/dvlu66yrx/image/upload/v1603696784/alison-wang-mou0S7ViElQ-unsplash_1_ol9xj0.jpg"
    },
    followers:[{type: ObjectId, ref:"User"}],
    following:[{type:ObjectId, ref:"User"}]
    
});

mongoose.model("User", userSchema);
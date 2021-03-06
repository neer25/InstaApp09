const mongoose = require("mongoose");
const{ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({

    title:{
        
        type: String,
        required: true

    },
    body: {
        
        type: String,
        required: true

    },
    photo: {
        
        type: String,
        required: true

    },
    postedBy: {
        
        type: ObjectId,
        ref: "User"

    },
    likes:[{ type: ObjectId, ref: "User" }], // Here likes array stores different user ids who gave likes

    comments:[{
        text: String,
        postedBy: {type: ObjectId, ref:"User"}
    }]
    
});


mongoose.model("Post", postSchema);
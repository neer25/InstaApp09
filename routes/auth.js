const express = require("express");
const router = express.Router();         // Router is used because we have created a separated file for handling routes
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const{JWT_SECRET} = require("../config/keys");  // Using two dots before key because we are moving two directories up from current file location
const requireLogin = require("../middleware/requireLogin");



router.post("/signup", (req, res) => {
    
    const {name,password,email,pic} = req.body;


    if(!email || !password || !name)
    {
        return res.status(422).json({error: "please add all the fields"});  // returning as we do not want to proceed further
    }

    
    User.findOne({email: email})
    .then((savedUser) => {
        
        if(savedUser)   // if user with same email already exists
        {
            return res.status(422).json({message: "user already exists with that email"});
        }

        // otherwise create a new user with that email

        // encrypt the user password before storing it into mongodb database
    

        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            
            // creating a new user with hashed password

            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                pic:pic
            });
    
            user.save()
            .then((user) => {
                res.json({message: "saved successfully!"});
            })
            .catch(error => {
                console.log(error);
            });
    
    
        });

        
    })
    .catch(error => {
        console.log(error);
    });

    

});


router.post("/signin", (req, res) => {

    const {email, password} = req.body;

    if(!email || !password)
    {
        return res.status(422).json({error:"please add email or password"});
    }

    User.findOne({email: email})
    .then((savedUser) => {

        if(!savedUser)  // If user is not found for the given email
        {
            return res.status(422).json({error:"Invalid email or password"});
        }

        // If user found for the given email, compare the password

        bcrypt.compare(password, savedUser.password)    // Will give a boolean value -> taken as doMatch (either true or false) in then chain
        .then(doMatch => {

            if(doMatch)
            {
                // res.json({message: "succesfully signed in!"});

                // Generating jwt token where we are signing using savedUser _id (ahead line information may be not correct as _id : savedUser._id may be stating the fact that _id just stores the _id of savedUser document) & then assigning back into _id as payload
                
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);

                const {_id, name, email, followers, following, pic} = savedUser;

                res.json({token: token,
                user: {
                    _id,name,email,followers,following,pic    // Special Hack: If both keys & values are same, we can condense into one word like -> {token: token} becomes {token} & same with _id ,name ,email in user object
                }
                });   

            }

            else
            {
                return res.status(422).json({error:"Invalid email or password"});
            }
        })
        .catch(error => {
            console.log(error);
        });


    })
    .catch(error => {
            console.log(error);
    });


});


module.exports = router;

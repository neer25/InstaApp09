const express = require("express");
const router = express.Router();         // Router is used because we have created a separated file for handling routes
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");


router.get("/allpost", requireLogin, (req, res) => {

    Post.find()
    .populate("postedBy","_id name")    // We want to populate postedBy by only _id & name
    .populate("comments.postedBy","_id name")
    .then(posts => {
        res.json({posts: posts});
    })
    .catch(error => {
        console.log(error);
    });

});


router.post("/createpost", requireLogin, (req, res) => {

    const{title, body, pic} = req.body;  // Here in req.body, we are specifically using body because it's a norm as in postman every route has parts like headers, body etc.

    //console.log(title,body,pic);

    if(!title || !body || !pic)
    {
        return res.status(422).json({error: "Please add all the fields"});
    }

    req.user.password = undefined;
    
    const post = new Post({
        
        title: title,
        body: body,
        photo: pic,
        //postedBy: req.user._id
        postedBy: req.user

    });

    post.save().then(result => {
        res.json({post: result});
    })
    .catch(error => {
        console.log(error);
    });


});


router.get("/mypost", requireLogin, (req, res) => {
    
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {

        res.json({mypost: mypost});

    })
    .catch(error => {
        console.log(error);
    });

});


router.put("/like", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, 
    
        {  
            $push:{likes:req.user._id}  // Add user id into likes array
        }, 
        {
            new : true  // We are here writing true otherwise mongodb will return old record
        }

    ).exec((err,result) => {
        if(err)
        {
            return res.status(422).json({error:err});
        }
        else
        {
            res.json(result);
        }
    });

    
});




router.put("/unlike", requireLogin, (req, res) => {

    Post.findByIdAndUpdate(req.body.postId, 
    
        {  
            $pull:{likes:req.user._id}  // Remove user id into likes array
        }, 
        {
            new : true  // We are here writing true otherwise mongodb will return old record
        }

    ).exec((err,result) => {
        if(err)
        {
            return res.status(422).json({error:err});
        }
        else
        {
            res.json(result);
        }
    });

    
});


router.put("/comment", requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }


    Post.findByIdAndUpdate(req.body.postId, 
    
        {  
            $push:{comments: comment}  // Add user id into likes array
        }, 
        {
            new : true  // We are here writing true otherwise mongodb will return old record
        }

    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err,result) => {
        if(err)
        {
            return res.status(422).json({error:err});
        }
        else
        {
            res.json(result);
        }
    });

    
});


router.delete("/deletepost/:postId", requireLogin,(req, res) => {    // :postId is params
    
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err});
        }

        if(post.postedBy._id.toString() === req.user._id.toString())  // We are converting the object id to string so as to use ===
        {
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err =>{
                console.log(err);
            })
        }
    })

})



module.exports = router;
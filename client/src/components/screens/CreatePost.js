import React,{useState, useEffect} from "react";
import M from "materialize-css";
import {useHistory} from "react-router-dom";


const CreatePost = () => {

    // After UI stuff starts here

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {

        if(url) // Also , useEffect will also kick when components are mounted so as to prevent that this if condition used which specifies that it will kick in only when url is present
        {

        // Network request to backend

        fetch("/createpost", {     

            method: "post",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title: title,      
                body: body,
                pic: url
            })

        })
        .then(res => res.json())
        .then(data => {

            
            if(data.error)
            {
                M.toast({html: data.error, classes: "#c62828 red darken-3"});
            }

            if(!data.error)
            {
                M.toast({html: "created post successfully!", classes: "#43a047 green darken-1"});

                history.push("/");

            }

        })
        .catch(err => {
            console.log(err);
        });



        }


    }, [url]);  // Here useEffect is used to bring synchronous effect to app, where firstly one opeartion is performed then it moves to next. [] is a dependency array here which mentions that firslly fetch cloudinary request performed then only move to fetch backend request

    // useEffect will kick in whenever we update url through setUrl

    // see vid 24 for more clear understanding on this topic



    const history = useHistory();

    const postDetails = () => {

        const data = new FormData();

        // append required data here as per your cloudinary

        // Add image/upload along with api to cloudinary where we provide storage for pics & then get pic url as a response back from cloudinary json response

        fetch("your cloudinary api", {

            method: "post",
            body: data

        })
        .then(res => res.json())
        .then(data => {
            
            setUrl(data.url);

        })
        .catch(err => {
            console.log(err);
        });

        

    }



    // After UI stuff ends here


    // In e.target.files[0] given below, files is an array where we access only first elemet present at 0th index

    return(

        <div className= "card input-filed" style= {{margin: "80px auto", maxWidth: "500px", padding: "20px", textAlign: "center"}}>

            <h5>Create a new post</h5>
            <input type= "text" placeholder= "title" value = {title} onChange = {e => setTitle(e.target.value)}/>
            <input type= "text" placeholder= "body" value = {body} onChange = {e => setBody(e.target.value)}/>

                <div className="file-field input-field">
                    <div className="btn #2196f3 blue">
                        <span>UPLOAD IMAGE</span>
                        <input type="file" onChange = {e => setImage(e.target.files[0])}/>   
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>

                <button className="btn waves-effect waves-light btn1 #2196f3 blue" onClick = {() => postDetails()}>
                    SUBMIT POST
                </button>

        </div>

    );
}

export default CreatePost;
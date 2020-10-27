import React, {useState, useEffect} from "react";
import {Link, useHistory} from "react-router-dom";  // useHistory hook is used to bring user to signin screen after completing with signup part
import M from "materialize-css";


const Signup = () => {


    // After UI stuff starts here

    const history = useHistory();

    const [name, setName] = useState("");   // Our input text html name tag is in sync with the state
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const[url, setUrl] = useState(undefined);


    useEffect(() => {
        if(url)
        {
            uploadFields();
        }
    },[url]);



    // In fetch() , instead of relative address http://localhost:5000/signup, we can use /signup only if proxy added in package.json
    

    const postDetails = () => {

        const data = new FormData();

        // append data as per your cloudinary

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


    const uploadFields = () =>{

        if(email && !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){

            M.toast({html: "invalid email", classes: "#c62828 red darken-3"});
            return;
        }

        fetch("/signup", {     // Two arguments used: 1st for API call & 2nd for API details

            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: name,      // Here first name is key & second name is value from const name of useState
                password: password,
                email: email,
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
                M.toast({html: data.message, classes: "#43a047 green darken-1"});

                // redirecting user to login page

                history.push("/signin");

            }

        })
        .catch(err => {
            console.log(err);
        });
            
    }





    const PostData = () => {    // Network Request

        // validating email pattern entered

        if(image)
        {
            postDetails();
        }
        else
        {
            uploadFields();
        }

        
    }

    // After UI stuff ends here


    return(
        <div className= "mycard">
            <div className="card auth-card input-field">
               
               <h2 className= "brand-logo">InstaApp</h2>
               <input type= "text" placeholder= "name" value = {name} onChange = {(e) => setName(e.target.value)}/>
               <input type= "text" placeholder= "email" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
               <input type= "password" placeholder= "password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
               

               <div className="file-field input-field">
                    <div className="btn #2196f3 blue">
                        <span>UPLOAD PIC</span>
                        <input type="file" onChange = {e => setImage(e.target.files[0])}/>   
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>


               <button className="btn waves-effect waves-light btn1 #2196f3 blue" onClick = {() => PostData()}>
                    Signup
               </button>

            
               
                
            </div>

            <div  className= "hhh">
            <h7>
                   <Link to= "/signin" className= "hh">Already have an account?</Link>
            </h7>
            </div>

        </div>
    );
}

export default Signup;
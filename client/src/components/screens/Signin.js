import React, {useState, useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import {UserContext} from "../../App";
import M from "materialize-css";

const Signin = () => {

    // After UI stuff starts here

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const {state, dispatch} = useContext(UserContext);

    const SigninData = () => {

        fetch("/signin", {
            
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if(data.error)
            {
                M.toast({html: data.error, classes: "#c62828 red darken-3"});
            }

            if(!data.error)
            {
                // Stroring incoming token from backend into local storage

                localStorage.setItem("jwt", data.token);

                // You have to strngify the json object data.user before storing it into local storage

                localStorage.setItem("user", JSON.stringify(data.user));

                dispatch({type:"USER", payload: data.user});
                
                M.toast({html: "signedin successfully!", classes: "#43a047 green darken-1"});
                history.push("/");
            }
        })

    }

    // After UI stuff ends here

    return(
        <div className= "mycard">
            <div className="card auth-card input-field">
               
               <h2 className= "brand-logo">InstaApp</h2>
               <input type= "text" placeholder= "email" value = {email} onChange = {e => setEmail(e.target.value)}/>
               <input type= "password" placeholder= "password" value = {password} onChange = {e => setPassword(e.target.value)}/>
               
               <div className="hhh">
               <button className="btn waves-effect waves-light btn1 #2196f3 blue" onClick = {() => SigninData()}>
                    Login
               </button>

               <h6 className= "hhh">
                   <Link to= "/signup" className= "hh">Create a new account</Link>
               </h6>
               </div>
                
            </div>
        </div>
    );
}

export default Signin;
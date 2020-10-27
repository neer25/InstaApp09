import React, {useContext} from "react";
import {Link, useHistory} from "react-router-dom";  // You can use Link instead of anchor tags to prevent frequent refreshing of page on clicking items on page thereby giving rapid injection of components in a single web page application
import {UserContext} from "../App";

const Navbar = () => {

    const{state, dispatch} = useContext(UserContext); // state basically stores the user details like user email etc

    const history = useHistory();

    const renderList = () => {

      if(state)
      {
         return [
          
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">Create Post</Link></li>,
          <li>
            <button className="btn #64b5f6 #64b5f6 blue lighten-2" style= {{marginRight: "15px"}} 
             onClick = {() => {

              localStorage.clear();
              dispatch({type: "CLEAR"});
              history.push("/signin");

            }}
            >
              Logout
            </button>
          </li>

         ];
      }

      else
      {
        return [
            <li><Link to="/signin">Signin</Link></li>,
            <li><Link to="/signup">Signup</Link></li>
        ];
      }

    }
     
    return(
    <nav>
        <div className="nav-wrapper blue">
          <Link to={state?"/":"/signin"} className="brand-logo left">InstaApp</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
      );
         
}


export default Navbar;
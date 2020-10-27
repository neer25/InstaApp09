import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from "./components/Navbar";
import Footbar from "./components/Footbar";
import "./App.css";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import {reducer, initialState} from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";



// App.js is the first component which gets loaded therefore it is crucial to maintain the central app level state here

// We are using CONTEXT API here instead of REDUX to maintain centralized app level state.

// Note: We cannot access the history inside BrowserRouter thereby created seperate Routing to use history inside it

// useReducer hook of react can be understood same as the useState hook which re renders components when state is changed but we use useReducer with context.



export const UserContext = createContext(); // Initialize the context

const Routing = () => { // Switch ensures that at one time only one route works

  const history = useHistory();

  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));
   


    if(user)
    {
      dispatch({type: "USER", payload: user});
    }

    else
    {
      history.push("/signin");
    }

  }, []); // dependency array is empty here as we want useEffect to kick in when components gets mounted


  return(

    <Switch>  
    
      <Route exact path= "/">
        <Home/>
      </Route>

      <Route path= "/signin">
        <Signin/>
      </Route>

      <Route exact path= "/profile">
        <Profile/>
      </Route>

      <Route path= "/signup">
        <Signup/>
      </Route>

      <Route path= "/create">
        <CreatePost/>
      </Route>

      <Route path= "/profile/:userid">
        <UserProfile/>
      </Route>


    </Switch>

  );

}

function App() {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  // We are creating access of state in all Routing components

  // Maybe the destructured state & dispatch of above useReducer hook is injected into the below given keys of UserContext Provider i.e. state: state (from reducer) & value: (from reducer)

  return (
    
    <UserContext.Provider value = {{state: state, dispatch: dispatch}}> 
    <BrowserRouter> 
      
      <Navbar/>
      <Routing/>
      <Footbar/>

    </BrowserRouter>
    </UserContext.Provider>
   

  );
}

export default App;

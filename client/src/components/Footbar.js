import React from "react";
import {Link} from "react-router-dom";

const Footbar = () => {

    return(
        
        <footer className="page-footer foot #bdbdbd grey lighten-1 brand-logo">
            <Link to="/"><h1 style= {{margin: "30px 0px", textAlign: "center"}}>InstaApp</h1></Link>
        </footer>


    );
}

export default Footbar;
import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../../App";


const Profile = () => {

    const [mypics, setPics] = useState([]);

    const {state, dispatch} = useContext(UserContext);  // While using Context, sometimes you need state or sometimes dispatch or sometimes both

    useEffect(() => {
        fetch("/mypost", {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setPics(result.mypost);
        });


    }, []);     // Here [] empty dependency array is used so as to put useEffect come into effect only once the component is loaded or mounted for the first time

    return(
        
        <div style= {{maxWidth: "850px", margin: "0px auto"}}>
            
            <div style= {{
                display: "flex",
                justifyContent: "flex-left",
                margin: "40px 0px",
                paddingBottom: "40px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px", margin: "0px 100px"}} src= {state ? state.pic : "loading..."}/>
                </div>

                <div style= {{width: "300px"}}>
                    <h4>{state ? state.name : "loading"}</h4>

                    {console.log(state)}

                    <div style= {{display: "flex", justifyContent: "space-between"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state ? state.followers.length : "0"} followers</h6>
                        <h6>{state ? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>
        
            <div className= "gallery" style= {{marginBottom: "40px"}}>
                
                {
                    mypics.map(item => {

                        return(
                            <img className="item" src = {item.photo} alt = {item.title}/>
                        );
                    })

                }
                
            </div>

        </div>

    );
}

export default Profile;
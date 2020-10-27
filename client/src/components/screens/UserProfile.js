import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../../App";
import {useParams} from "react-router-dom";

const Profile = () => {

    const [userProfile, setProfile] = useState(null);

    const {state, dispatch} = useContext(UserContext);  // While using Context, sometimes you need state or sometimes dispatch or sometimes both

    const {userid} = useParams();

    const [showfollow, setShowFollow] = useState(state ? state.followers.includes(userid) : true);

    
    useEffect(() => {
        
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            //console.log(result);

            
            setProfile(result);
        });


    }, []);     // Here [] empty dependency array is used so as to put useEffect come into effect only once the component is loaded or mounted for the first time


    
    const followUser = () => {
        
        fetch("/follow", {
            method: "put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            dispatch({type: "UPDATE", payload:{following:data.following, followers: data.followers}});
            localStorage.setItem("user", JSON.stringify(data));
            

            // This prevState is not context previous state but the setprofile prev state conatining both user and posts objects

            setProfile(prevState => { // Loading prev state & spreading it then storing it with new data

                return {    // this below given logic is complicated, form your own logic here
                    
                    ...prevState,  // actually this is a predefined format to update the state given the scenario where prev state is already present & u want to update it ...for that first u have to call prevstate, the things wgich are to be modified ....also have a look upon reducer file
                    user:{...prevState.user,
                    followers:[...prevState.user.followers, data._id] // appending
                }}
            }
            
            )
            setShowFollow(false);

        })

    }





    const unfollowUser = () => {
        
        fetch("/unfollow", {
            method: "put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            dispatch({type: "UPDATE", payload:{following:data.following, followers: data.followers}});
            localStorage.setItem("user", JSON.stringify(data));
            
            
            setProfile(prevState => { 

                const newFollowers = prevState.user.followers.filter(item => item != data._id) // creating new followers array filtering and excluding the one who unfollowed
                
                return {    
                    
                    ...prevState,  // actually this is a predefined format to update the state given the scenario where prev state is already present & u want to update it ...for that first u have to call prevstate, the things wgich are to be modified ....also have a look upon reducer file
                    user:{...prevState.user,
                    followers:newFollowers
                }}
            }
            
            )

        })

    }







    return( // Using empty fragments <> to avoid return error 

        <>  

        {userProfile ?

                        <div style= {{maxWidth: "850px", margin: "0px auto"}}>
                                        
                            <div style= {{
                                display: "flex",
                                justifyContent: "flex-left",
                                margin: "40px 0px",
                                paddingBottom: "40px",
                                borderBottom: "1px solid grey"
                            }}>
                                <div>
                                    <img style={{width: "160px", height: "160px", borderRadius: "80px", margin: "0px 100px"}} src= {userProfile.user.pic}/>
                                </div>

                                <div style= {{width: "300px"}}>
                                    
                                    <h4>{userProfile.user.name}</h4>
                                    <h5>{userProfile.user.email}</h5>

                                    <div style= {{display: "flex", justifyContent: "space-between"}}>
                                        <h6>{userProfile.posts.length} posts</h6>
                                        <h6>{userProfile.user.followers.length} followers</h6>
                                        <h6>{userProfile.user.following.length} following</h6>
                                    </div>

                                    {showfollow ?
                                    <div style={{marginTop:"15px"}}>
                                    <button className="btn waves-effect waves-light btn1 #2196f3 blue" onClick = {() => followUser()}>
                                        Follow
                                    </button>
                                    </div>
                                    :
                                    <div style={{marginTop:"15px"}}>
                                    <button className="btn waves-effect waves-light btn1 #2196f3 blue" onClick = {() => unfollowUser()}>
                                        Unfollow
                                    </button>
                                    </div>

                                    }

                                    

                                </div>
                            </div>

                            <div className= "gallery" style= {{marginBottom: "40px"}}>
                                
                                {
                                    userProfile.posts.map(item => {

                                        return(
                                            <img className="item" src = {item.photo} alt = {item.title}/>
                                        );
                                    })

                                }
                                
                            </div>

                        </div>
         
        :
        <h2>loading...</h2>
        }
        
        

        </>

    );
}

export default Profile;
import React, {useState, useEffect, useContext} from "react";
import {UserContext} from "../../App";
import {Link} from "react-router-dom";

const Home = () => {

    const [data, setData] = useState([]);

    const {state, dispatch} = useContext(UserContext);

    useEffect(() => {

        fetch("/allpost", {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            
            setData(result.posts);
        });

    }, [data]);

    // { stores jsx -> html + js inside curly braces } 

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {

            const newData =  data.map(item => { // Here newData is a new array through which we are updating the state of data after modifying likes or unlikes
                
                if(item.title == result.title)
                {
                    return result;
                }
                else
                {
                    return item;
                }

            }); 

            setData(newData);      
            
        }).catch(err => {
            console.log(err);
        });
    }


    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {

            const newData =  data.map(item => { // Here newData is a new array through which we are updating the state of data after modifying likes or unlikes
                
                if(item.title == result.title)
                {
                    return result;
                }
                else
                {
                    return item;
                }

                

            }); 

            setData(newData);      
            
        }).catch(err => {
            console.log(err);
        });
    }


    const makeComment = (text, postId) => {

        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:   JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
        .then(result => {
            
            console.log(result);

            const newData =  data.map(item => { // Here newData is a new array through which we are updating the state of data after modifying likes or unlikes
                
                if(item.title == result.title)
                {
                    return result;
                }
                else
                {
                    return item;
                }

                

            }); 

            setData(newData);      
            
        }).catch(err => {
            console.log(err);
        });
        
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method:"delete",
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result);

            const newData = data.filter(item => { // This time we are just filtering out data according to the postId which is to be deleted except remaining all to be filtered out in newdata array
               
                return item._id !== result._id;

            })

            setData(newData);

        })
    }


    return(
        
        <div className= "home">

            {
                data.map(item => {
                    return(

                        <div className= "card home-card">
                            <h5><Link className="hh" to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id  &&  <i className="material-icons" style= {{float: "right"}} onClick={() => deletePost(item._id)}>delete</i>}</h5>
                
                             <div className= "card-image">
                                <img src= {item.photo}/>
                            </div>

                            <div className= "card-content">
                            <i className="material-icons" style= {{color: "red"}}>favorite</i>
                            {
                            item.likes.includes(state._id) 
                            ?
                            <i className="material-icons" onClick = {() => unlikePost(item._id)}>thumb_down</i>
                            :
                            <i className="material-icons" onClick = {() => likePost(item._id)}>thumb_up</i>
                            }
                            
                            
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>

                                {
                                    item.comments.map(record => {
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight: "500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        );
                                    })

                                }

                                <form onSubmit ={(e) => {
                                    e.preventDefault();    // To prevent the refreshing of form while submitting  
                                    makeComment(e.target[0].value, item._id);
                                }}>

                                <input type= "text" placeholder= "comment"></input>
                                </form>
                            </div>
                        </div>

                    );
                })

            }


            
        </div>
    );
}

export default Home;
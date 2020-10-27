const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require("./config/keys");   // destructuring the data into const variable from object


mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

mongoose.connection.on("connected", () => {
    console.log("connected to mongodb atlas");
})

mongoose.connection.on("error", (error) => {
    console.log("error connecting to mongodb atlas", error);
})


require("./models/user");   // we are not using const variable to assign as we have not exported the model User

require("./models/post");

app.use(express.json());    // to parse the incoming requests in json format

app.use(require("./routes/auth"));  // to register our routes from auth.js

app.use(require("./routes/post"));

app.use(require("./routes/user"));




if(process.env.NODE_ENV == "production")    // if app is running on production side then serve the static css js html files in build folder of client through express
{
    app.use(express.static("client/build")) // serving static files
    
    const path = require("path")    // requiring path module
    
    app.get("*", (req, res)=> {     // it means on receiving any request from client we will simply send index.html file present in build folder as index.html contains our entire react application & its entire logic 
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}




app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
});

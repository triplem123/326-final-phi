const mongoose = require("mongoose");

mongoose.connect("https://team-phi.herokuapp.com");

mongoose.connection.once("open", ()=>{
    console.log("Connection has been made");
}).on("error", (error) =>{
    console.log("Connection error", error);
})
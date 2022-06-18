const express = require("express");
const app = express();

// to access the POST request data
const bodyParser = require("body-parser");
// mandatory everytime you wanna get the form data
app.use(bodyParser.urlencoded({extended: true}));

const ejs = require("ejs");

//setting up our app's view engine
// there are many modules other than 'ejs'. but it is the easiest to work with, so we are using it.
app.set('view engine', 'ejs'); 

//to serve static files like css stylesheets, js files, etc
app.use(express.static("public"));

// requiring date.js which gives out today's date
const date = require(__dirname + "/date.js");

//to-do list array
let items = [];

//work items array
let workItems = [];

app.get("/", (req, res)=>{

    let day = date.getDate();

    res.render("list", {listTitle: day, items});
    
})
app.post("/", (req, res)=>{

    let toDo = req.body.toDo;

    if( req.body.list=="Work List"){

        workItems.push(toDo);

        res.redirect("/work");

    }else{

        console.log(toDo);
        
        items.push(toDo);
        
        res.redirect("/");
    }
})

// work to-do lists
app.get("/work", (req, res)=>{

    res.render("list", {listTitle: "Work List", items: workItems});

})
app.post("/work", (req, res)=>{

    let toDo = req.body.toDo;

    console.log(toDo);

    workItems.push(toDo);

    res.redirect("/work");

})

//about page
app.get("/about", (req, res)=>{

    res.render("about");
})


app.listen(8080, ()=>{
    console.log("listening on port 8080");
})
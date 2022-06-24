const express = require("express");
const app = express();
// installing lodash to handle the routes
const _ = require("lodash");

// to access the POST request data
const bodyParser = require("body-parser");
// mandatory everytime you wanna get the form data
app.use(bodyParser.urlencoded({
    extended: true
}));

const ejs = require("ejs");

//setting up our app's view engine
// there are many modules other than 'ejs'. but it is the easiest to work with, so we are using it.
app.set('view engine', 'ejs');

//to serve static files like css stylesheets, js files, etc
app.use(express.static("public"));

//to-do list array
let items = [];

//work items array
let workItems = [];

// requiring mongoose
const mongoose = require("mongoose");

// connecting to mongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB");

// creating the todolist item schema
const itemsSchema = new mongoose.Schema({

    name: {

        type: String,
        required: true
    }
})

// creating the todolist items document/object
const Item = mongoose.model("Item", itemsSchema);

// hard coding default items
const item1 = new Item({

    name: "Welcome to your ToDo List"
})
const item2 = new Item({

    name: " <-- Hit this box to delete this task"
})
const item3 = new Item({

    name: "Hit + button to add a new task"
})

const defaultItems = [item1, item2, item3];

// uploading default list items to the database
// Item.insertMany( [item1, item2, item3] , (err) => {

//     if(err){

//         console.log(err);
//     }else{

//         console.log("successfully added the items ");
//     }
// })





// ROUTES FOR TODO LIST APP
app.get("/", (req, res) => {

    // rendering databse items and passing it to home page
    Item.find({}, (err, results) => {

        // if there is no todolist items
        if( results.length===0){

            // add list items to database
            Item.insertMany(defaultItems, (err) => {

                if(err){
                    
                    console.log(err);
                }else{

                    console.log("successfully added default items to DB")
                }
            })

            // go to homepage
            res.redirect("/");
        
        }else{

            // if not empty, render with the found results...and pass them to the page
            res.render("list", {listTitle: "Today", results});

        }
    })

})
// posts method for both default list and dynamic lists
app.post("/", (req, res) => {

    // getting the item name/content
    let itemName = req.body.toDo;

    // getting the list title
    let listName = req.body.list;

    // creating the list item
    const newItem = new Item({

        name: itemName
    });

    // checking if the route is default or not
    if( listName=="Today" ){
        
        // saving the newly created item to the database
        newItem.save();
        
        // redirect to home page
        res.redirect("/");

    }else{

        // finding in the List document
        List.findOne({name: listName}, (err, foundList) => {

            if(err){

                console.log(err);
            }else{

                // pushing the newly created item
                // to the items array of that specific list 
                foundList.items.push(newItem);
                // saving to database
                foundList.save();

                // redrecting to the dynamic/specific list
                res.redirect("/"+listName);
            }
        })
    }
})

// todolist items delete post route 
app.post("/delete", (req, res) => {

    const checkedItemId = req.body.checkbox;

    const listName = req.body.listName;

    console.log(listName);

    // checking if the list from the default list
    if( listName=="Today"){

        Item.findByIdAndRemove(checkedItemId, (err) => {

            if(err){

                console.log(err);
            }else{

                console.log("successfully deleted the item");

                res.redirect("/");
            }
        });

    }else{

        // we have to go through list document, and search all lists
        //  then search the items array inside it and delete the list item

        // using $pull operator

        /*

        findOneAndUpdate
        =================

        <MODEL NAME>.findOneAndUpdate({conditions}, { $pull: {field: {query}}}, callback -> function(err, results) => ...)

        */

        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, results) => {

            if(err){

                console.log(err);
            }else{

                res.redirect("/" + listName);
            }
        })
    }
})

// creating list schema for dynamic lists
const listSchema = new mongoose.Schema({

    name: String,
    items: [itemsSchema]
})
// creating the model for dynamic lists
const List = mongoose.model("List", listSchema);

// dynamic todo lists
app.get("/:id", (req, res) => {

    // getting the list title
    // using lodash.capitalize([string])
    // to convert each string's first character to upper case and rest characters to lower case
    const customListName = _.capitalize(req.params.id);

    // finding if the dynamic list already exists or not
    List.findOne({name: customListName}, (err, results) => {

        if(err){

            console.log(err);
        }else{

            if( !results ){

                const list = new List({

                    name: customListName,
                    items: defaultItems
                });

                list.save();

                res.redirect("/" + customListName);

                console.log("does not exists");
            }else{

                res.render("list", {listTitle: results.name, results: results.items})

                console.log("exists");
            }
        }
    })
    
})





app.listen(8080, () => {
    console.log("listening on port 8080");
})
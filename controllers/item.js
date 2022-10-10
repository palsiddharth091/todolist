const _ = require('lodash')
const Item = require('../models/item')
const List = require('../models/list')

const item1 = new Item({
  name: 'Welcome to your ToDo List',
})
const item2 = new Item({
  name: ' <-- Hit this box to delete this task',
})
const item3 = new Item({
  name: 'Hit + button to add a new task',
})

const defaultItems = [item1, item2, item3]

exports.getAllItems = (req, res) => {
  // rendering database items and passing it to home page
  Item.find({}, (err, results) => {
    // if there is no todolist items
    if (results.length === 0) {
      // add list items to database
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('successfully added default items to DB')
        }
      })

      // go to homepage
      res.redirect('/')
    } else {
      // if not empty, render with the found results...and pass them to the page
      res.render('list', { listTitle: 'Today', results })
    }
  })
}

// posts method for both default list and dynamic lists
exports.postItem = (req, res) => {
  // getting the item name/content
  let itemName = req.body.toDo

  // getting the list title
  let listName = req.body.list

  // creating the list item
  const newItem = new Item({
    name: itemName,
  })

  // checking if the route is default or not
  if (listName == 'Today') {
    // saving the newly created item to the database
    newItem.save()

    // redirect to home page
    res.redirect('/')
  } else {
    // finding in the List document
    List.findOne({ name: listName }, (err, foundList) => {
      if (err) {
        console.log(err)
      } else {
        // pushing the newly created item
        // to the items array of that specific list
        foundList.items.push(newItem)
        // saving to database
        foundList.save()

        // redrecting to the dynamic/specific list
        res.redirect('/' + listName)
      }
    })
  }
}

// todolist items delete post route
exports.deleteItem = (req, res) => {
  const checkedItemId = req.body.checkbox

  const listName = req.body.listName

  console.log(listName)

  // checking if the list from the default list
  if (listName == 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('successfully deleted the item')

        res.redirect('/')
      }
    })
  } else {
    // we have to go through list document, and search all lists
    //  then search the items array inside it and delete the list item
    // using $pull operator
    /*
          findOneAndUpdate
          =================
          <MODEL NAME>.findOneAndUpdate({conditions}, { $pull: {field: {query}}}, callback -> function(err, results) => ...)
    */

    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, results) => {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/' + listName)
        }
      }
    )
  }
}

// dynamic todo lists
exports.getList = (req, res) => {
  // getting the list title
  // using lodash.capitalize([string])
  // to convert each string's first character to upper case and rest characters to lower case
  const customListName = _.capitalize(req.params.id)

  // finding if the dynamic list already exists or not
  List.findOne({ name: customListName }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      if (!results) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        })

        list.save()

        res.redirect('/' + customListName)

        console.log('does not exists')
      } else {
        res.render('list', { listTitle: results.name, results: results.items })

        console.log('exists')
      }
    }
  })
}

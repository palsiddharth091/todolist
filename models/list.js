const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
  name: String,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
})

module.exports = mongoose.model('List', listSchema)

const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/todolistDB',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log('Connected to MongoDB')
    }
  )
}

module.exports = connectDB

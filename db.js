// const mongoose = require('mongoose')

// require('dotenv').config()

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI).then(()=>{
//     console.log('connection successful')
//   }).catch((err)=>{
//     console.log(err)
//   })
// }

// module.exports = connectDB

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

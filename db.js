 const mongoose = require('mongoose')

 require('dotenv').config()

  const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('connection successful')
  }).catch((err)=>{
    console.log(err)
 })
}

module.exports = connectDB


require('dotenv').config()
const express = require('express')
const app = express()
const todoRoutes = require('./routes/todos')
const mongoose = require('mongoose')
const cors = require('cors');

app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRoutes)

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Listening to server")
    })
}).catch((error) => {
    console.log(error)
})
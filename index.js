const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const moongose = require('mongoose');

const app = express()
app.use(cors())
app.use(helmet())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


moongose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database Conected")
})
.catch((err)=>{
    console.log(err)
})


app.get('/', (req,res) =>{
    res.json({message:"Hello for the server"})

})

app.listen(process.env.PORT, ()=>{
    console.log("listening.....")
})
const express=require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const fileUpload = require("express-fileupload");

var cors = require('cors')
dotenv.config();


const api=require('./routes/api')

app.use(cors());
app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
));


app.use('/',api);
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser:true},
    ()=>{
        console.log("Yup I am Alive")
    })


app.use(express.json);

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
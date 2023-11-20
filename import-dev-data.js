const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./models/tourModel');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_pw);

mongoose.connect(DB
    // ,{
    // userNewUrlParser: true,
    // userCreateIndex: true,
    // userFindAndModify: false,
    // useUnifiedTopology: true,
// }
).then((con)=>{
    // console.log(con.connections);
    console.log("DB connection successful.");

});

//read the file 
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/data/tours.json`,'utf-8')
);

//InSert into the database 
const importData = async ()=>{
    try{
        // await Tour.create(tours);
        await Tour.insertMany(tours);
        console.log('Data Successfully Loaded');
    }catch(err){
        console.log(err);
    }
};
//Delete All Collections from DataBase 
const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        console.log("Data successfully deleted");
    }catch(err){
        console.log(err);
    }
}
// deleteData();
importData();
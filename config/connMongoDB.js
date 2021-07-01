const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//Set up default mongoose connection
const userDB = process.env.DB_USERNAME;
const passDB = process.env.DB_PASSWORD;
const hostDB = process.env.DB_HOST;
const portDB = process.env.DB_PORT;
const nameDB = process.env.DB_DATABASE;
const nameDBAuth = process.env.DB_AUTH;
const mongoDB = userDB !== '' ? 'mongodb://'+userDB+':'+passDB+'@'+hostDB+':'+portDB+'/'+nameDB+'?authSource='+nameDBAuth : 'mongodb://'+hostDB+':'+portDB+'/'+nameDB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('DB connected:'+mongoDB))
        .catch((err)=>console.log(err));

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// module.exports = mongoose;
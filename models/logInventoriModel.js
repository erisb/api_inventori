const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
// const dInventoriModel = require('./dInventoriModel');

const logInventori = new schema({
    idInventori:{type: mongoose.Schema.Types.ObjectId},
    logActivity:{type: String},
    logStatus:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

logInventori.plugin(timeZone,{paths:['created_at','updated_at']});
const logInventories = mongoose.model('logInventories',logInventori);
module.exports = logInventories;
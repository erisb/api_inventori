const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');

const masterRuangan = new schema({
    roomName:{type: String},
    roomDetail:{type: String},
    note:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

masterRuangan.plugin(timeZone,{paths:['created_at','updated_at']});
module.exports = mongoose.model('mRooms',masterRuangan);
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');

const tokenMobile = new schema({
    accessToken:{type: String},
    active:{type: Boolean},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

tokenMobile.plugin(timeZone,{paths:['created_at','updated_at']});
module.exports = mongoose.model('tokenMobiles',tokenMobile);
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');

const masterUser = new schema({
    userName:{type: String},
    userEmail:{type: String},
    userPassword:{type: String},
    accessToken:{type: String},
    refreshToken:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

masterUser.plugin(timeZone,{paths:['created_at','updated_at']});
module.exports = mongoose.model('mUsers',masterUser);
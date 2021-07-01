const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');

const listRuangan = new schema({
    _id:false,
    nameRoom:{type: String}
});
const masterLokasi = new schema({
    locationName:{type: String},
    locationRoom:[listRuangan],
    locationDetail:{type: String},
    locationOrder:{type:Number},
    note:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

masterLokasi.plugin(timeZone,{paths:['created_at','updated_at']});
const mLocations = mongoose.model('mLocations',masterLokasi);
module.exports = mLocations;
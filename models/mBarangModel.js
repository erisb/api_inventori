const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
const mKategoriModel = require('./mKategoriModel');

const masterBarang = new schema({
    itemCategory:{type: mongoose.Schema.Types.ObjectId,ref:mKategoriModel},
    itemName:{type: String},
    itemMerk:{type: String},
    itemDetail:{type: String},
    note:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

masterBarang.plugin(timeZone,{paths:['created_at','updated_at']});
const mItems = mongoose.model('mItems',masterBarang);
module.exports = mItems;
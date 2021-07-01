const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');

const masterKategori = new schema({
    categoryName:{type: String},
    categoryDetail:{type: String},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now,select:false}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

masterKategori.plugin(timeZone,{paths:['created_at','updated_at']});
const mCategory = mongoose.model('mCategories',masterKategori);
module.exports = mCategory;
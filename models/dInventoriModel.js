const mongoose = require('mongoose');
const schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
const mLocationsModel = require('./mLokasiModel');
const mItemsModel = require('./mBarangModel');
// const mCategoryModel = require('./mKategoriModel');

const dataInventori = new schema({
    invUnit:{type: mongoose.Schema.Types.ObjectId,ref:mLocationsModel},
    invRoom:{type: String},
    invItem:{type: mongoose.Schema.Types.ObjectId,ref:mItemsModel},
    invCategoryItem:{type: mongoose.Schema.Types.ObjectId},
    invSize:{type: String},
    invMerk:{type: String},
    invTotal:{type: String},
    invFoto:{type: String},
    invCondition:{type: String},
    invNote:{type: String},
    invStatus:{type: String,enum:['Aman','Butuh Check','Menunggu Vendor','Dalam Perbaikan']},
    created_at:{type: Date,default:Date.now,select:false},
    updated_at:{type: Date,default:Date.now}
},{autoCreate: true,versionKey: false,timestamps:{createdAt:'created_at',updatedAt:'updated_at'}});

dataInventori.plugin(timeZone,{paths:['created_at','updated_at']});
module.exports = mongoose.model('Inventories',dataInventori);
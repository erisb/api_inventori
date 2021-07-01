const mBarangModel = require('../models/mBarangModel');
const func = require('../allFunctions');

exports.allBarang = async function(req,res){
    try {
        let dataBarang = await mBarangModel.find().populate(['itemCategory']).select(['_id','itemCategory','itemName','itemMerk','itemDetail','note']).sort({_id:-1}).exec();
        if (dataBarang.length === 0) {
            res.json({'statusCode':'121','message':'Gagal tampilkan data Barang','data':dataBarang});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data Barang','data':dataBarang});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.allBarangByKategori = async function(req,res){
    try {
        let dataBarang = await mBarangModel.find({itemCategory:req.body.kategori_barang}).select(['_id','itemCategory','itemName','itemMerk','itemDetail','note']).sort({_id:-1}).exec();
        if (dataBarang.length === 0) {
            res.json({'statusCode':'121','message':'Gagal tampilkan data Barang','data':dataBarang});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data Barang','data':dataBarang});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveBarang = async function(req,res){
    try {
        let mBarang = new mBarangModel();
        if (req.body.kategori_barang !== '') {
            mBarang.itemCategory = req.body.kategori_barang;
            mBarang.itemName = req.body.nama_barang;
            mBarang.itemMerk = req.body.merk_barang;
            mBarang.itemDetail = req.body.detil_barang;
            mBarang.note = req.body.keterangan;
        } else {
            mBarang.itemName = req.body.nama_barang;
            mBarang.itemMerk = req.body.merk_barang;
            mBarang.itemDetail = req.body.detil_barang;
            mBarang.note = req.body.keterangan;
        }

        let saveBarang = await mBarang.save();
        if (Object.keys(saveBarang).length === 0) {
            res.json({'statusCode':'122','message':'Gagal simpan data Barang'});
        } else {
            func.getBarang(req.body.kategori_barang,async function(data){
                res.json({'statusCode':'000','message':'Berhasil simpan data Barang','data': data});
            });
        }
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateBarang = async function(req,res){
    try {
        let dataBarang = await mBarangModel.findById(req.params.barang_id).exec();
        if (Object.keys(dataBarang).length === 0) {
            res.json({'statusCode':'121','message':'Gagal tampilkan data Barang'});
        } else {
            if (req.body.kategori_barang !== '') {
                dataBarang.itemCategory = req.body.kategori_barang;
                dataBarang.itemName = req.body.nama_barang;
                dataBarang.itemMerk = req.body.merk_barang;
                dataBarang.itemDetail = req.body.detil_barang;
                dataBarang.note = req.body.keterangan;
            } else {
                dataBarang.itemCategory = null;
                dataBarang.itemName = req.body.nama_barang;
                dataBarang.itemMerk = req.body.merk_barang;
                dataBarang.itemDetail = req.body.detil_barang;
                dataBarang.note = req.body.keterangan;
            }

            let saveBarang = await dataBarang.save();
            if (Object.keys(saveBarang).length === 0) {
                res.json({'statusCode':'123','message':'Gagal ubah data Barang'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil ubah data Barang'});
            }
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteBarang = async function(req,res){
    try {
        let hapusBarang = await mBarangModel.deleteOne({_id:req.params.barang_id});
        if (hapusBarang.deletedCount == 0) {
            res.json({'statusCode':'124','message':'Gagal hapus data Barang'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data Barang'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getBarangFirstPage = function(req,res){
    try {
        mBarangModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataBarang){
            if (err) {
                res.json({'statusCode':'121','message':'Gagal tampilkan data Barang'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Barang','data':dataBarang});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getBarangNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        mBarangModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataBarang){
            if (err) {
                res.json({'statusCode':'121','message':'Gagal tampilkan data Barang'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Barang','data':dataBarang});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchBarang = function(req,res){
    try {
        mBarangModel.find({$or:[{itemName:{$regex:'.*'+req.body.search+'.*',$options: 'i'}},{itemDetail:{$regex:'.*'+req.body.search+'.*',$options: 'i'}}]}).exec(function(err,dataBarang){
            if (err) {
                res.json({'statusCode':'121','message':'Gagal tampilkan data Barang'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Barang','data':dataBarang});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
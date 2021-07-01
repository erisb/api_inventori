const mKategoriModel = require('../models/mKategoriModel');

exports.allKategori = async function(req,res){
    try {
        let dataKategori = await mKategoriModel.find({}).select(['_id','categoryName','categoryDetail']).sort({_id:-1}).exec();
        if (dataKategori.length === 0) {
            res.json({'statusCode':'151','message':'Gagal tampilkan data Kategori','data':dataKategori});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data Kategori','data':dataKategori});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveKategori = async function(req,res){
    try {
        let mKategori = new mKategoriModel();
        mKategori.categoryName = req.body.nama_kategori;
        mKategori.categoryDetail = req.body.detil_kategori;

        let saveKategori = await mKategori.save();
        if (Object.keys(saveKategori).length === 0) {
            res.json({'statusCode':'152','message':'Gagal simpan data Kategori'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil simpan data Kategori'});
        }
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateKategori = async function(req,res){
    try {
        let dataKategori = await mKategoriModel.findById(req.params.kategori_id).exec();
        if (Object.keys(dataKategori).length === 0) {
            res.json({'statusCode':'151','message':'Gagal tampilkan data Kategori'});
        } else {
            dataKategori.categoryName = req.body.nama_kategori;
            dataKategori.categoryDetail = req.body.detil_kategori;
            
            let saveKategori = await dataKategori.save();
            if (Object.keys(saveKategori).length === 0) {
                res.json({'statusCode':'153','message':'Gagal ubah data Kategori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil ubah data Kategori'});
            }
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteKategori = async function(req,res){
    try {
        let hapusKategori = await mKategoriModel.deleteOne({_id:req.params.kategori_id});
        if (hapusKategori.deletedCount == 0) {
            res.json({'statusCode':'154','message':'Gagal hapus data Kategori'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data Kategori'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getKategoriFirstPage = function(req,res){
    try {
        mKategoriModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataKategori){
            if (err) {
                res.json({'statusCode':'151','message':'Gagal tampilkan data Kategori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Kategori','data':dataKategori});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getKategoriNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        mKategoriModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataKategori){
            if (err) {
                res.json({'statusCode':'151','message':'Gagal tampilkan data Kategori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Kategori','data':dataKategori});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchKategori = function(req,res){
    try {
        mKategoriModel.find({$or:[{categoryName:{$regex:'.*'+req.body.search+'.*',$options: 'i'}},{categoryDetail:{$regex:'.*'+req.body.search+'.*',$options: 'i'}}]}).exec(function(err,dataKategori){
            if (err) {
                res.json({'statusCode':'151','message':'Gagal tampilkan data Kategori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data Kategori','data':dataKategori});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
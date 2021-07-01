const mLokasiModel = require('../models/mLokasiModel');

exports.allLokasi = async function(req,res){
    try {
        let dataLokasi = await mLokasiModel.find({}).select(['_id','locationName','locationRoom','locationDetail','locationOrder','note']).sort({_id:-1}).exec();
        if (dataLokasi.length === 0) {
            res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi','data':dataLokasi});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data lokasi','data':dataLokasi});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveLokasi = async function(req,res){
    try {
        let mLokasi = new mLokasiModel();
        mLokasi.locationName = req.body.nama_lokasi;
        mLokasi.locationRoom = req.body.list_ruangan;
        mLokasi.locationDetail = req.body.detil_lokasi;
        mLokasi.locationOrder = req.body.order_lokasi;
        mLokasi.note = req.body.keterangan;
        
        let saveLokasi = await mLokasi.save();
        if (Object.keys(saveLokasi).length === 0) {
            res.json({'statusCode':'102','message':'Gagal simpan data lokasi'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil simpan data lokasi'});
        }
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateLokasi = async function(req,res){
    try {
        let dataLokasi = await mLokasiModel.findById(req.params.lokasi_id).exec();
        if (Object.keys(dataLokasi).length === 0) {
            res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi'});
        } else {
            dataLokasi.locationName = req.body.nama_lokasi;
            dataLokasi.locationRoom = req.body.list_ruangan;
            dataLokasi.locationDetail = req.body.detil_lokasi;
            dataLokasi.locationOrder = req.body.order_lokasi;
            dataLokasi.note = req.body.keterangan;

            let saveLokasi = await dataLokasi.save();
            if (Object.keys(saveLokasi).length === 0) {
                res.json({'statusCode':'103','message':'Gagal ubah data lokasi'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil ubah data lokasi'});
            }
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteLokasi = async function(req,res){
    try {
        let hapusLokasi = await mLokasiModel.deleteOne({_id:req.params.lokasi_id});
        if (hapusLokasi.deletedCount == 0) {
            res.json({'statusCode':'104','message':'Gagal hapus data lokasi'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data lokasi'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getLokasiFirstPage = function(req,res){
    try {
        mLokasiModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataLokasi){
            if (err) {
                res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data lokasi','data':dataLokasi});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getLokasiNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        mLokasiModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataLokasi){
            if (err) {
                res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data lokasi','data':dataLokasi});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchLokasi = function(req,res){
    try {
        mLokasiModel.find({$or:[{locationName:{$regex:'.*'+req.body.search+'.*',$options: 'i'}},{locationDetail:{$regex:'.*'+req.body.search+'.*',$options: 'i'}}]}).exec(function(err,dataLokasi){
            if (err) {
                res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data lokasi','data':dataLokasi});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
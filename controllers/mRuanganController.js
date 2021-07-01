const mRuanganModel = require('../models/mRuanganModel');

exports.allRuangan = async function(req,res){
    try {
        let dataRuangan = await mRuanganModel.find({}).select(['_id','roomName','roomDetail','note']).sort({_id:-1}).exec();
        if (dataRuangan.length === 0) {
            res.json({'statusCode':'141','message':'Gagal tampilkan data ruangan','data':dataRuangan});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data ruangan','data':dataRuangan});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveRuangan = async function(req,res){
    try {
        let mRuangan = new mRuanganModel();
        mRuangan.roomName = req.body.nama_ruangan;
        mRuangan.roomDetail = req.body.detil_ruangan;
        mRuangan.note = req.body.keterangan;
        
        let saveRuangan = await mRuangan.save();
        if (Object.keys(saveRuangan).length === 0) {
            res.json({'statusCode':'142','message':'Gagal simpan data ruangan'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil simpan data ruangan'});
        }
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateRuangan = async function(req,res){
    try {
        let dataRuangan = await mRuanganModel.findById(req.params.ruang_id).exec();
        if (Object.keys(dataRuangan).length === 0) {
            res.json({'statusCode':'141','message':'Gagal tampilkan data ruangan'});
        } else {
            dataRuangan.roomName = req.body.nama_ruangan;
            dataRuangan.roomDetail = req.body.detil_ruangan;
            dataRuangan.note = req.body.keterangan;
            
            let saveRuangan = await dataRuangan.save();
            if (Object.keys(saveRuangan).length === 0) {
                res.json({'statusCode':'143','message':'Gagal ubah data ruangan'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil ubah data ruangan'});
            }
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteRuangan = async function(req,res){
    try {
        let hapusRuangan = await mRuanganModel.deleteOne({_id:req.params.ruang_id});
        if (hapusRuangan.deletedCount == 0) {
            res.json({'statusCode':'144','message':'Gagal hapus data ruangan'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data ruangan'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getRuanganFirstPage = function(req,res){
    try {
        mRuanganModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataRuangan){
            if (err) {
                res.json({'statusCode':'141','message':'Gagal tampilkan data ruangan'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data ruangan','data':dataRuangan});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getRuanganNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        mRuanganModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataRuangan){
            if (err) {
                res.json({'statusCode':'141','message':'Gagal tampilkan data ruangan'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data ruangan','data':dataRuangan});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchRuangan = function(req,res){
    try {
        mRuanganModel.find({roomName:{$regex:'.*'+req.body.search+'.*',$options: 'i'}}).exec(function(err,dataRuangan){
            if (err) {
                res.json({'statusCode':'101','message':'Gagal tampilkan data ruangan'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data ruangan','data':dataRuangan});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
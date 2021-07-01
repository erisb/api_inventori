const dInventoriModel = require('../models/dInventoriModel');
const mLokasiModel = require('../models/mLokasiModel');
const mRuanganModel = require('../models/mRuanganModel');
const mKategoriModel = require('../models/mKategoriModel');
const mBarangModel = require('../models/mBarangModel');
const logModel = require('../models/logInventoriModel');
const func = require('../allFunctions');
const dotenv = require('dotenv');
dotenv.config();
const path = require("path");
const OSS = require('ali-oss');
const client = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET
});

exports.allInventori = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find().populate(['invUnit','invItem']).sort({_id:-1}).exec();
        const arrBaru = [];

        for (let i=0;i<dataInventori.length;i++) {
            let invCategory = dataInventori[i].invItem !== null ? dataInventori[i].invItem.itemCategory : '';
            arrBaru.push({
                "_id":dataInventori[i]._id,
                "invUnit":dataInventori[i].invUnit,
                "invRoom":dataInventori[i].invRoom,
                "invCategoryItem":dataInventori[i].invCategoryItem === undefined ? invCategory : dataInventori[i].invCategoryItem,
                "invItem":dataInventori[i].invItem,
                "invSize":dataInventori[i].invSize,
                "invMerk":dataInventori[i].invMerk,
                "invTotal":dataInventori[i].invTotal,
                "invFoto":dataInventori[i].invFoto,
                "invCondition":dataInventori[i].invCondition,
                "invNote":dataInventori[i].invNote,
                "invStatus":dataInventori[i].invStatus
            });
        }
        if (dataInventori.length === 0) {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori','data':arrBaru});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':arrBaru});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveInventori = async function(req,res){
    try {
        if (req.file === undefined) {
            let mInventori = new dInventoriModel();
            mInventori.invUnit = req.body.unit_inventori;
            mInventori.invRoom = req.body.ruangan_inventori;
            mInventori.invCategoryItem = req.body.kategori_barang_inventori;
            mInventori.invItem = req.body.barang_inventori;
            mInventori.invSize = req.body.ukuran_inventori;
            mInventori.invMerk = req.body.merk_inventori;
            mInventori.invTotal = req.body.total_inventori;
            mInventori.invCondition = req.body.kondisi_inventori;
            mInventori.invNote = req.body.keterangan_inventori;
            mInventori.invStatus = req.body.status_inventori;

            let saveInventori = await mInventori.save();
            if (Object.keys(saveInventori).length === 0) {
                res.json({'statusCode':'132','message':'Gagal simpan data inventori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil simpan data inventori'});
            }
        } else {
            let filePath = req.file.path;
            let fileName = req.file.fieldname + "-" + Date.now() + path.extname(req.file.originalname);
            
            if (!filePath) {
                res.status(400).send({
                status: false,
                data: "No File is selected.",
                });
            } else {
                await client.multipartUpload('foto_inventori/'+fileName,filePath);

                let mInventori = new dInventoriModel();
                mInventori.invUnit = req.body.unit_inventori;
                mInventori.invRoom = req.body.ruangan_inventori;
                mInventori.invCategoryItem = req.body.kategori_barang_inventori;
                mInventori.invItem = req.body.barang_inventori;
                mInventori.invSize = req.body.ukuran_inventori;
                mInventori.invMerk = req.body.merk_inventori;
                mInventori.invTotal = req.body.total_inventori;
                mInventori.invFoto = process.env.OSS_DOMAIN+'/foto_inventori/'+fileName;
                mInventori.invCondition = req.body.kondisi_inventori;
                mInventori.invNote = req.body.keterangan_inventori;
                mInventori.invStatus = req.body.status_inventori;

                let saveInventori = await mInventori.save();
                if (Object.keys(saveInventori).length === 0) {
                    res.json({'statusCode':'132','message':'Gagal simpan data inventori'});
                } else {
                    res.json({'statusCode':'000','message':'Berhasil simpan data inventori'});
                }
            }
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateInventori = async function(req,res){
    try {
        if (req.file === undefined) {
            let dataInventori = await dInventoriModel.findById(req.params.inv_id).exec();
            const arrDataLama = {...dataInventori._doc};
            
            if (Object.keys(dataInventori).length === 0) {
                res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
            } else {

                dataInventori.invUnit = req.body.unit_inventori;
                dataInventori.invRoom = req.body.ruangan_inventori;
                dataInventori.invCategoryItem = req.body.kategori_barang_inventori;
                dataInventori.invItem = req.body.barang_inventori;
                dataInventori.invSize = req.body.ukuran_inventori;
                dataInventori.invMerk = req.body.merk_inventori;
                dataInventori.invTotal = req.body.total_inventori;
                dataInventori.invCondition = req.body.kondisi_inventori;
                dataInventori.invNote = req.body.keterangan_inventori;
                dataInventori.invStatus = req.body.status_inventori;
                
                let saveInventori = await dataInventori.save();
                if (Object.keys(saveInventori).length === 0) {
                    func.saveLog(arrDataLama,req.body,dataInventori._id,'Gagal');
                    res.json({'statusCode':'133','message':'Gagal ubah data inventori'});
                } else {
                    func.saveLog(arrDataLama,req.body,dataInventori._id,'Sukses');
                    res.json({'statusCode':'000','message':'Berhasil ubah data inventori'});
                }
            }

        } else {

            let filePath = req.file.path;
            let fileName = req.file.fieldname + "-" + Date.now() + path.extname(req.file.originalname);

            if (!filePath) {
                res.status(400).send({
                status: false,
                data: "No File is selected.",
                });
            } else {
                let dataInventori = await dInventoriModel.findById(req.params.inv_id).exec();
                let urlFotoLama = dataInventori.invFoto !== undefined ? dataInventori.invFoto.split(process.env.OSS_DOMAIN)[1] : '';
                const arrDataLama = {...dataInventori._doc};
                
                if (Object.keys(dataInventori).length === 0) {
                    res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
                } else {
                    urlFotoLama !== '' ? await client.delete(urlFotoLama) : console.log('no action');

                    await client.multipartUpload('foto_inventori/'+fileName,filePath);

                    dataInventori.invUnit = req.body.unit_inventori;
                    dataInventori.invRoom = req.body.ruangan_inventori;
                    dataInventori.invCategoryItem = req.body.kategori_barang_inventori;
                    dataInventori.invItem = req.body.barang_inventori;
                    dataInventori.invSize = req.body.ukuran_inventori;
                    dataInventori.invMerk = req.body.merk_inventori;
                    dataInventori.invTotal = req.body.total_inventori;
                    dataInventori.invFoto = process.env.OSS_DOMAIN+'/foto_inventori/'+fileName;
                    dataInventori.invCondition = req.body.kondisi_inventori;
                    dataInventori.invNote = req.body.keterangan_inventori;
                    dataInventori.invStatus = req.body.status_inventori;

                    const arrDataBaru = {...req.body,"foto_inventori":process.env.OSS_DOMAIN+'/foto_inventori/'+fileName}
                
                    let saveInventori = await dataInventori.save();
                    if (Object.keys(saveInventori).length === 0) {
                        func.saveLog(arrDataLama,arrDataBaru,dataInventori._id,'Gagal');
                        res.json({'statusCode':'133','message':'Gagal ubah data inventori'});
                    } else {
                        func.saveLog(arrDataLama,arrDataBaru,dataInventori._id,'Sukses');
                        res.json({'statusCode':'000','message':'Berhasil ubah data inventori'});
                    }
                }
            }

        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteInventori = async function(req,res){
    try {
        let dataGmbrInventori = await dInventoriModel.findById(req.params.inv_id).exec();
        let urlFoto = dataGmbrInventori.invFoto !== undefined ? dataGmbrInventori.invFoto.split(process.env.OSS_DOMAIN)[1] : '';
        urlFoto !== '' ? await client.delete(urlFoto) : console.log("no action");
        let hapusInventori = await dInventoriModel.deleteOne({_id:req.params.inv_id});
        if (hapusInventori.deletedCount == 0) {
            res.json({'statusCode':'134','message':'Gagal hapus data inventori'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data inventori'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getInventoriFirstPage = function(req,res){
    try {
        dInventoriModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataInventori){
            if (err) {
                res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':dataInventori});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getInventoriNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        dInventoriModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataInventori){
            if (err) {
                res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':dataInventori});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchInventori = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find().populate(['invUnit','invItem']);
        const arrBaru = [];
        let panjangData = dataInventori.length;
        const hasilCariData = [];

        for (let i=0;i<panjangData;i++) {
            arrBaru.push({
                "_id":dataInventori[i]._id,
                "invUnit":dataInventori[i].invUnit !== null ? dataInventori[i].invUnit.locationName : '',
                "invRoom":dataInventori[i].invRoom,
                "invCategoryItem":dataInventori[i].invCategoryItem === undefined ? invCategory : dataInventori[i].invCategoryItem,
                "invItem":dataInventori[i].invItem !== null ? dataInventori[i].invItem.itemName : '',
                "invSize":dataInventori[i].invSize,
                "invMerk":dataInventori[i].invMerk,
                "invTotal":dataInventori[i].invTotal,
                "invFoto":dataInventori[i].invFoto,
                "invCondition":dataInventori[i].invCondition,
                "invNote":dataInventori[i].invNote,
                "invStatus":dataInventori[i].invStatus
            });
        }
        
        let cariItem = arrBaru.filter(obj => obj.invItem.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariUnit = arrBaru.filter(obj => obj.invUnit.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariRoom = arrBaru.filter(obj => obj.invRoom.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariSize = arrBaru.filter(obj => obj.invSize.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariMerk = arrBaru.filter(obj => obj.invMerk.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariTotal = arrBaru.filter(obj => obj.invTotal.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariCondition = arrBaru.filter(obj => obj.invCondition.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        let cariNote = arrBaru.filter(obj => obj.invNote.toLowerCase().indexOf(req.body.search.toLowerCase()) >= 0);
        cariItem.length !== 0 ? hasilCariData.push(cariItem) : cariUnit.length !== 0 ? hasilCariData.push(cariUnit) : 
        cariRoom.length !== 0 ? hasilCariData.push(cariRoom) : cariSize.length !== 0 ? hasilCariData.push(cariSize) : 
        cariMerk.length !== 0 ? hasilCariData.push(cariMerk) : cariTotal.length !== 0 ? hasilCariData.push(cariTotal) : 
        cariCondition.length !== 0 ? hasilCariData.push(cariCondition) : cariNote.length !== 0 ? hasilCariData.push(cariNote) : {};

        if (hasilCariData.length !== 0) {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':hasilCariData});
        } else {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getInventoriMobile = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find({invUnit:req.params.unit}).populate(['invUnit','invItem']).sort({_id:-1}).exec();
        const arrBaru = [];
        let panjangData = dataInventori.length;
        // let dataLokasi = await mLokasiModel.find().select(['locationName','locationRoom']).sort({locationOrder:-1}).exec();
        // let dataRuangan = await mRuanganModel.find().select(['roomName']).sort({_id:-1}).exec();
        // let dataKategori = await mKategoriModel.find().select(['categoryName']).sort({_id:-1}).exec();
        // let dataBarang = await mBarangModel.find().populate(['itemCategory']).select(['itemCategory','itemName','itemMerk']).sort({_id:-1}).exec();
        
        for (let i=0;i<panjangData;i++) {
            arrBaru.push({
                "_id":dataInventori[i]._id,
                "unit":dataInventori[i].invUnit !== null ? dataInventori[i].invUnit.locationName : '',
                "item":dataInventori[i].invItem !== null ? dataInventori[i].invItem.itemName : '',
                "room":dataInventori[i].invRoom,
                "total":dataInventori[i].invTotal,
                "status":dataInventori[i].invStatus !== undefined ? dataInventori[i].invStatus : '',
                "last_update":new Date(dataInventori[i].updated_at).getFullYear()+'-'+("0"+new Date(dataInventori[i].updated_at).getMonth()).slice(-2)+'-'+("0"+new Date(dataInventori[i].updated_at).getDate()).slice(-2)+' '+("0"+new Date(dataInventori[i].updated_at).getHours()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getMinutes()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getSeconds()).slice(-2),
                "image":dataInventori[i].invFoto,
            });
        }

        // const arrBaruCombine = [...arrBaru,{"data_unit":dataLokasi},{"data_ruangan":dataRuangan},{"data_kategori":dataKategori},{"data_barang":dataBarang}];

        if (arrBaru.length === 0) {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori','data':arrBaru});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':arrBaru});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getDetilInventoriMobile = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find({_id:req.params.inv_id}).populate(['invUnit','invItem']).exec();
        let dataLog = await logModel.find({idInventori:req.params.inv_id,logStatus:"Sukses"}).select(['logActivity','logStatus','updated_at']).sort({_id:-1}).exec();
        const arrBaruLog = [];

        for (let j=0;j<dataLog.length;j++) {
            arrBaruLog.push({
                "activity":dataLog[j].logActivity,
                "last_update":new Date(dataLog[j].updated_at).getFullYear()+'-'+("0"+new Date(dataLog[j].updated_at).getMonth()).slice(-2)+'-'+("0"+new Date(dataLog[j].updated_at).getDate()).slice(-2)+' '+("0"+new Date(dataLog[j].updated_at).getHours()).slice(-2)+':'+("0"+new Date(dataLog[j].updated_at).getMinutes()).slice(-2)+':'+("0"+new Date(dataLog[j].updated_at).getSeconds()).slice(-2)
            })
        }

        const arrBaru = {
            "_id":dataInventori[0]._id,
            "unit":dataInventori[0].invUnit !== null ? dataInventori[0].invUnit.locationName : '',
            "room":dataInventori[0].invRoom,
            "item":dataInventori[0].invItem !== null ? dataInventori[0].invItem.itemName : '',
            "merk":dataInventori[0].invMerk,
            "size":dataInventori[0].invSize,
            "total":dataInventori[0].invTotal,
            "condition":dataInventori[0].invCondition,
            "note":dataInventori[0].invNote,
            "status":dataInventori[0].invStatus,
            "last_update":new Date(dataInventori[0].updated_at).getFullYear()+'-'+("0"+new Date(dataInventori[0].updated_at).getMonth()).slice(-2)+'-'+("0"+new Date(dataInventori[0].updated_at).getDate()).slice(-2)+' '+("0"+new Date(dataInventori[0].updated_at).getHours()).slice(-2)+':'+("0"+new Date(dataInventori[0].updated_at).getMinutes()).slice(-2)+':'+("0"+new Date(dataInventori[0].updated_at).getSeconds()).slice(-2),
            "image":dataInventori[0].invFoto,
            "log":arrBaruLog
        }

        if (arrBaru.length === 0) {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori','data':arrBaru});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':arrBaru});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchInventoriMobile = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find({invUnit:req.body.unit}).populate(['invUnit','invItem']).sort({_id:-1}).exec();
        const arrBaru = [];
        let panjangData = dataInventori.length;

        for (let i=0;i<panjangData;i++) {
            arrBaru.push({
                "_id":dataInventori[i]._id,
                "unit":dataInventori[i].invUnit !== null ? dataInventori[i].invUnit.locationName : '',
                "item":dataInventori[i].invItem !== null ? dataInventori[i].invItem.itemName : '',
                "room":dataInventori[i].invRoom,
                "total":dataInventori[i].invTotal,
                "last_update":new Date(dataInventori[i].updated_at).getFullYear()+'-'+("0"+new Date(dataInventori[i].updated_at).getMonth()).slice(-2)+'-'+("0"+new Date(dataInventori[i].updated_at).getDate()).slice(-2)+' '+("0"+new Date(dataInventori[i].updated_at).getHours()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getMinutes()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getSeconds()).slice(-2),
                "image":dataInventori[i].invFoto,
            });
        }

        let cariItem = arrBaru.filter(obj => obj.item.toLowerCase().indexOf(req.body.search.trim().toLowerCase()) >= 0);
        
        if (cariItem.length !== 0) {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':cariItem});
        } else {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.allLokasiMobile = async function(req,res){
    try {
        let dataLokasi = await mLokasiModel.find().select(['locationName','locationRoom']).sort({locationOrder:-1}).exec();
        const arrBaru = [];
        
        for (let i=0;i<dataLokasi.length;i++){
            let dataInventori = await dInventoriModel.find({invUnit:dataLokasi[i]._id}).populate(['invUnit','invItem']).sort({_id:-1}).exec();
            let total = 0;
            for (let j=0;j<dataInventori.length;j++){
                total += parseInt(dataInventori[j].invTotal);
            }
            arrBaru.push({
                "_id":dataLokasi[i]._id,
                "unit":dataLokasi[i].locationName,
                "total":total
            })
        }

        if (arrBaru.length === 0) {
            res.json({'statusCode':'101','message':'Gagal tampilkan data lokasi','data':arrBaru});
        } else {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data lokasi','data':arrBaru});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    } 
};

exports.searchLokasiMobile = async function(req,res){
    try {
        let dataInventori = await dInventoriModel.find().populate(['invUnit','invItem']).sort({_id:-1}).exec();
        const arrBaru = [];
        let panjangData = dataInventori.length;
        
        for (let i=0;i<panjangData;i++) {
            arrBaru.push({
                "_id":dataInventori[i]._id,
                "idUnit":dataInventori[i].invUnit !== null ? dataInventori[i].invUnit._id : '',
                "unit":dataInventori[i].invUnit !== null ? dataInventori[i].invUnit.locationName : '',
                "item":dataInventori[i].invItem !== null ? dataInventori[i].invItem.itemName : '',
                "room":dataInventori[i].invRoom,
                "total":dataInventori[i].invTotal,
                "last_update":new Date(dataInventori[i].updated_at).getFullYear()+'-'+("0"+new Date(dataInventori[i].updated_at).getMonth()).slice(-2)+'-'+("0"+new Date(dataInventori[i].updated_at).getDate()).slice(-2)+' '+("0"+new Date(dataInventori[i].updated_at).getHours()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getMinutes()).slice(-2)+':'+("0"+new Date(dataInventori[i].updated_at).getSeconds()).slice(-2),
                "image":dataInventori[i].invFoto
            });
        }
        
        let cariItem = arrBaru.filter(obj => obj.item.toLowerCase().indexOf(req.body.search.trim().toLowerCase()) >= 0);
        let cariUnit = arrBaru.filter(obj => obj.unit.toLowerCase().indexOf(req.body.search.trim().toLowerCase()) >= 0);
        let hasilCariData = cariItem.length !== 0 ? cariItem : cariUnit.length !== 0 ? cariUnit : [];
        
        if (hasilCariData.length !== 0) {
            res.json({'statusCode':'000','message':'Berhasil tampilkan data inventori','data':hasilCariData});
        } else {
            res.json({'statusCode':'131','message':'Gagal tampilkan data inventori'});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
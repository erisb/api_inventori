const mUserModel = require('../models/mUserModel');
const tokenMobileModel = require('../models/tokenMobileModel');
let bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
const func = require('../allFunctions');

exports.allUser = async function(req,res){
    try {
        let dataUser = await mUserModel.find({}).sort({_id:-1}).exec();
        if (dataUser.length === 0) {
            await res.json({'statusCode':'301','message':'Gagal tampilkan data User','data':dataUser});
        } else {
            await res.json({'statusCode':'000','message':'Berhasil tampilkan data User','data':dataUser});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveUser = function(req,res){
    try {
        let mUser = new mUserModel();
        mUser.userName = req.body.nama_user;
        mUser.userEmail = req.body.email_user;
        mUser.userPassword = bcrypt.hashSync(req.body.password_user,salt);
        func.checkEmailUser(req.body.email_user,async function(count){
            if (count === 0) {
                let saveUser = await mUser.save();
                if (Object.keys(saveUser).length === 0) {
                    res.json({'statusCode':'302','message':'Gagal simpan data User'});
                } else {
                    res.json({'statusCode':'000','message':'Berhasil simpan data User'});
                }
            } else {
                res.json({'statusCode':'305','message':'Email sudah terdaftar'});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateUser = async function(req,res){
    try {
        let dataUser = await mUserModel.findById(req.params.user_id).exec();
        if (Object.keys(dataUser).length === 0) {
            res.json({'statusCode':'301','message':'Gagal tampilkan data User'});
        } else {
            if (req.body.password_user !== undefined && req.body.email_user === dataUser.userEmail) {
                dataUser.userName = req.body.nama_user;
                dataUser.userEmail = req.body.email_user;
                dataUser.userPassword = bcrypt.hashSync(req.body.password_user,salt);

                let saveUser = await dataUser.save();
                if (Object.keys(saveUser).length === 0) {
                    res.json({'statusCode':'303','message':'Gagal ubah data User'});
                } else {
                    res.json({'statusCode':'000','message':'Berhasil ubah data User'});
                }
            } else if (req.body.password_user !== undefined && req.body.email_user !== dataUser.userEmail) {
                dataUser.userName = req.body.nama_user;
                dataUser.userEmail = req.body.email_user;
                dataUser.userPassword = bcrypt.hashSync(req.body.password_user,salt);

                func.checkEmailUser(req.body.email_user,async function(count){
                    if (count === 0) {
                        let saveUser = await dataUser.save();
                        if (Object.keys(saveUser).length === 0) {
                            res.json({'statusCode':'303','message':'Gagal ubah data User'});
                        } else {
                            res.json({'statusCode':'000','message':'Berhasil ubah data User'});
                        }
                    } else {
                        res.json({'statusCode':'305','message':'Email sudah terdaftar'});
                    }
                });
            } else if (req.body.password_user === undefined && req.body.email_user === dataUser.userEmail) {
                dataUser.userName = req.body.nama_user;
                dataUser.userEmail = req.body.email_user;

                let saveUser = await dataUser.save();
                if (Object.keys(saveUser).length === 0) {
                    res.json({'statusCode':'303','message':'Gagal ubah data User'});
                } else {
                    res.json({'statusCode':'000','message':'Berhasil ubah data User'});
                }
            } else {
                dataUser.userName = req.body.nama_user;
                dataUser.userEmail = req.body.email_user;

                func.checkEmailUser(req.body.email_user,async function(count){
                    if (count === 0) {
                        let saveUser = await dataUser.save();
                        if (Object.keys(saveUser).length === 0) {
                            res.json({'statusCode':'303','message':'Gagal ubah data User'});
                        } else {
                            res.json({'statusCode':'000','message':'Berhasil ubah data User'});
                        }
                    } else {
                        res.json({'statusCode':'305','message':'Email sudah terdaftar'});
                    }
                });
            }
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.deleteUser = async function(req,res){
    try {
        let hapusUser = await mUserModel.deleteOne({_id:req.params.user_id});
        if (hapusUser.deletedCount == 0) {
            res.json({'statusCode':'304','message':'Gagal hapus data User'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil hapus data User'});
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getUserFirstPage = function(req,res){
    try {
        mUserModel.find().skip(0).limit(req.params.total).sort({_id:-1}).exec(function(err,dataUser){
            if (err) {
                res.json({'statusCode':'301','message':'Gagal tampilkan data User'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data User','data':dataUser});
            }
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.getUserNextPage = function(req,res){
    try {
        let skip = (req.params.total * req.params.page) - req.params.total
        mUserModel.find().skip(skip).limit(req.params.total).sort({_id:-1}).exec(function(err,dataUser){
            if (err) {
                res.json({'statusCode':'301','message':'Gagal tampilkan data User'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data User','data':dataUser});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.searchUser = function(req,res){
    try {
        mUserModel.find({$or:[{userName:{$regex:'.*'+req.body.search+'.*',$options: 'i'}},{userEmail:{$regex:'.*'+req.body.search+'.*',$options: 'i'}}]}).exec(function(err,dataUser){
            if (err) {
                res.json({'statusCode':'301','message':'Gagal tampilkan data User'});
            } else {
                res.json({'statusCode':'000','message':'Berhasil tampilkan data User','data':dataUser});
            }
        });

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.saveTokenMobile = async function(req,res){
    try {
        let token = new tokenMobileModel();
        token.accessToken = req.body.token;
        token.active = req.body.active;

        let saveToken = await token.save();
        if (Object.keys(saveToken).length === 0) {
            res.json({'statusCode':'144','message':'Gagal simpan token'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil simpan token'});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.updateTokenMobile = async function(req,res){
    try {
        let dataToken = await tokenMobileModel.findById(req.params.token_id).exec();
        if (req.body.token !== undefined) {
            dataToken.accessToken = req.body.token;
            dataToken.active = req.body.active;
        } else {
            dataToken.active = req.body.active;
        }

        let saveToken = await dataToken.save();
        if (Object.keys(saveToken).length === 0) {
            res.json({'statusCode':'144','message':'Gagal update token'});
        } else {
            res.json({'statusCode':'000','message':'Berhasil update token'});
        }

    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};
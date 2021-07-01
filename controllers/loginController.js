const mUserModel = require('../models/mUserModel');
let bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const func = require('../allFunctions');

exports.login = async function(req,res){
    try {
        
        let dataUser = await mUserModel.find({userEmail:req.body.email_user}).exec();
        
        if (dataUser.length === 0 || bcrypt.compareSync(req.body.password_user,dataUser[0].userPassword) === false) {
            res.json({'statusCode':'701','message':'Username atau password anda salah'});
        } else {
            let payload = {userEmail:dataUser[0].userEmail,userPassword:dataUser[0].userPassword};
            let accessToken = jwt.sign(payload,process.env.ACCESS_JWT_SECRET,{expiresIn:process.env.ACCESS_JWT_LIFE});
            let refreshToken = jwt.sign(payload,process.env.REFRESH_JWT_SECRET,{expiresIn:process.env.REFRESH_JWT_LIFE});
            let idUser = dataUser[0]._id;
            
            func.saveToken(idUser,accessToken,refreshToken, async function(data){
                let dataUserBaru = await mUserModel.find({userEmail:req.body.email_user}).select(['_id','userName','userEmail','accessToken']);
                if (data !== 'Sudah Login'){
                    res.json({'statusCode':'000','message':'Berhasil login. Mantull','data':dataUserBaru});
                } else {
                    res.json({'statusCode':'702','message':'Gagal Login. Anda sudah login sebelumnya'});
                }
            })
            
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.logout = async function(req,res){
    try {
        let cekUser = await mUserModel.find({userEmail:req.body.email_user});
        if (cekUser.length === 0 || cekUser[0].token === '') {
            res.json({'statusCode':'703','message':'Gagal logout. Data kosong'});
        } else {
            let dataUser = await mUserModel.findById(cekUser[0]._id).exec();
            if (dataUser.accessToken !== '') {
                dataUser.accessToken = '';
                dataUser.refreshToken = '';
                
                await dataUser.save();
                res.json({'statusCode':'000','message':'Berhasil logout'});
            } else {
                res.json({'statusCode':'704','message':'Gagal logout'});
            }
             
        }
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};

exports.refreshToken = async function(req,res){
    try {
        let dataUser = await mUserModel.findById(req.body.id).exec();
        let refreshToken = dataUser.refreshToken;
        jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async (err) => {
            if (err) {
                return res.status(403).json({'statusCode':403,'message':'Forbidden. Silahkan login kembali!'});
            }
            let payload = {userEmail:dataUser.userEmail,userPassword:dataUser.userPassword};
            let accessToken = jwt.sign(payload,process.env.ACCESS_JWT_SECRET,{expiresIn:process.env.ACCESS_JWT_LIFE});
            dataUser.accessToken = accessToken;

            await dataUser.save();
            res.json({'statusCode':'000','message':'Berhasil refresh token','accessToken':accessToken});
        });
        
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.message
        });
    }
    
};


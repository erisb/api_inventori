const express = require('express');
const routerApi = express.Router({caseSensitive:true,strict:true});
const routerAll = express.Router({caseSensitive:true,strict:true});
const mLokasiController = require('../controllers/mLokasiController');
const mBarangController = require('../controllers/mBarangController');
const mUserController = require('../controllers/mUserController');
const loginController = require('../controllers/loginController');
const inventoriController = require('../controllers/dInventoriController');
const mRuanganController = require('../controllers/mRuanganController');
const mKategoriController = require('../controllers/mKategoriController');
const multer = require('multer');
const path = require("path");
const diskStorage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({storage:diskStorage}).single('foto_inventori');
const reqMiddle = require('../middleware/reqMiddleware');
const authMiddle = require('../middleware/authMiddleware');
const authMobileMiddle = require('../middleware/authMobileMiddleware');
const groupEndPoint = '/apiinventory/v1/';

//start master lokasi//
routerApi.post('/masterLokasi',authMiddle,reqMiddle,mLokasiController.saveLokasi);
routerApi.put('/masterLokasi/:lokasi_id',authMiddle,reqMiddle,mLokasiController.updateLokasi);
routerApi.delete('/masterLokasi/:lokasi_id',authMiddle,mLokasiController.deleteLokasi);
routerApi.get('/masterLokasi',authMiddle,mLokasiController.allLokasi);
routerApi.get('/masterLokasi/first/:total',authMiddle,mLokasiController.getLokasiFirstPage);
routerApi.get('/masterLokasi/next/:total/page/:page',authMiddle,mLokasiController.getLokasiNextPage);
routerApi.post('/masterLokasi/search/lokasi',authMiddle,reqMiddle,mLokasiController.searchLokasi);
//end master lokasi//

//start master barang//
routerApi.post('/masterBarang',authMiddle,reqMiddle,mBarangController.saveBarang);
routerApi.put('/masterBarang/:barang_id',authMiddle,reqMiddle,mBarangController.updateBarang);
routerApi.delete('/masterBarang/:barang_id',authMiddle,mBarangController.deleteBarang);
routerApi.get('/masterBarang',authMiddle,mBarangController.allBarang);
routerApi.post('/masterBarang/by/kategori',authMiddle,reqMiddle,mBarangController.allBarangByKategori);
routerApi.get('/masterBarang/first/:total',authMiddle,mBarangController.getBarangFirstPage);
routerApi.get('/masterBarang/next/:total/page/:page',authMiddle,mBarangController.getBarangNextPage);
routerApi.post('/masterBarang/search/barang',authMiddle,reqMiddle,mBarangController.searchBarang);
//end master barang//

//start master user//
routerApi.post('/masterUser',authMiddle,reqMiddle,mUserController.saveUser);
routerApi.put('/masterUser/:user_id',authMiddle,reqMiddle,mUserController.updateUser);
routerApi.delete('/masterUser/:user_id',authMiddle,mUserController.deleteUser);
routerApi.get('/masterUser',authMiddle,mUserController.allUser);
routerApi.get('/masterUser/first/:total',authMiddle,mUserController.getUserFirstPage);
routerApi.get('/masterUser/next/:total/page/:page',authMiddle,mUserController.getUserNextPage);
routerApi.post('/masterUser/search/user',authMiddle,reqMiddle,mUserController.searchUser);
//end master user//

//start master ruangan//
routerApi.post('/masterRuangan',authMiddle,reqMiddle,mRuanganController.saveRuangan);
routerApi.put('/masterRuangan/:ruang_id',authMiddle,reqMiddle,mRuanganController.updateRuangan);
routerApi.delete('/masterRuangan/:ruang_id',authMiddle,mRuanganController.deleteRuangan);
routerApi.get('/masterRuangan',authMiddle,mRuanganController.allRuangan);
routerApi.get('/masterRuangan/first/:total',authMiddle,mRuanganController.getRuanganFirstPage);
routerApi.get('/masterRuangan/next/:total/page/:page',authMiddle,mRuanganController.getRuanganNextPage);
routerApi.post('/masterRuangan/search/ruangan',authMiddle,reqMiddle,mRuanganController.searchRuangan);
//end master ruangan//

//start master kategori//
routerApi.post('/masterKategori',authMiddle,reqMiddle,mKategoriController.saveKategori);
routerApi.put('/masterKategori/:kategori_id',authMiddle,reqMiddle,mKategoriController.updateKategori);
routerApi.delete('/masterKategori/:kategori_id',authMiddle,mKategoriController.deleteKategori);
routerApi.get('/masterKategori',authMiddle,mKategoriController.allKategori);
routerApi.get('/masterKategori/first/:total',authMiddle,mKategoriController.getKategoriFirstPage);
routerApi.get('/masterKategori/next/:total/page/:page',authMiddle,mKategoriController.getKategoriNextPage);
routerApi.post('/masterKategori/search/kategori',authMiddle,reqMiddle,mKategoriController.searchKategori);
//end master kategori//

//start data inventori//
routerApi.post('/inventori',authMiddle,upload,inventoriController.saveInventori);
routerApi.put('/inventori/:inv_id',authMiddle,upload,inventoriController.updateInventori);
routerApi.delete('/inventori/:inv_id',authMiddle,inventoriController.deleteInventori);
routerApi.get('/inventori',authMiddle,inventoriController.allInventori);
routerApi.get('/inventori/first/:total',authMiddle,inventoriController.getInventoriFirstPage);
routerApi.get('/inventori/next/:total/page/:page',authMiddle,inventoriController.getInventoriNextPage);
routerApi.post('/inventori/search/by',authMiddle,reqMiddle,inventoriController.searchInventori);
//end data inventori//

//start login logout//
routerApi.post('/login',reqMiddle,loginController.login);
routerApi.post('/logout',reqMiddle,loginController.logout);
routerApi.post('/refresh/token',reqMiddle,loginController.refreshToken);
//end login logout//

//start api mobile//
routerApi.get('/listUnit',authMobileMiddle,inventoriController.allLokasiMobile);
routerApi.post('/listUnit/search/unit',authMobileMiddle,reqMiddle,inventoriController.searchLokasiMobile);
routerApi.get('/listInventori/by/unit/:unit',authMobileMiddle,inventoriController.getInventoriMobile);
routerApi.get('/detilInventori/:inv_id',authMobileMiddle,inventoriController.getDetilInventoriMobile);
routerApi.post('/listInventori/search/item',authMobileMiddle,inventoriController.searchInventoriMobile);
routerApi.post('/token',reqMiddle,mUserController.saveTokenMobile);
routerApi.put('/token/:token_id',reqMiddle,mUserController.updateTokenMobile);
routerApi.post('/inventori/mobile',authMobileMiddle,upload,inventoriController.saveInventori);
routerApi.put('/inventori/mobile/:inv_id',authMobileMiddle,upload,inventoriController.updateInventori);
routerApi.get('/masterRuangan/mobile',authMobileMiddle,mRuanganController.allRuangan);
routerApi.get('/masterBarang/mobile',authMobileMiddle,mBarangController.allBarang);
routerApi.post('/masterBarang/mobile',authMobileMiddle,reqMiddle,mBarangController.saveBarang);
routerApi.get('/masterKategori/mobile',authMobileMiddle,mKategoriController.allKategori);
//end api mobile//

routerAll.use(groupEndPoint,routerApi);

module.exports = routerAll;
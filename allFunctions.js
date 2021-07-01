const mUserModel = require('./models/mUserModel');
const logModel = require('./models/logInventoriModel');
const mBarangModel = require('./models/mBarangModel');

exports.checkEmailUser = function(email,done) {
    try {
        mUserModel.countDocuments({userEmail:email}, function (err, count) {
            if (err){
                throw 'Error nih!!';
            }else{
                return done(count);
            }
        });
    } catch (err) {
        return err.message;
    }
};

exports.saveToken = async function(id,accessToken,refreshToken,done) {
    try {
        let dataUser = await mUserModel.findById(id).exec();
        if (Object.keys(dataUser).length === 0) {
            throw 'Data Kosong'
        } else {
            let saveUser;
            if ((dataUser.accessToken === undefined) || (dataUser.accessToken === '')) {
                dataUser.accessToken = accessToken;
                dataUser.refreshToken = refreshToken;

                saveUser = await dataUser.save();
                done(saveUser)
            } else {
               saveUser = 'Sudah Login';
               done(saveUser)
            }
        }
    } catch (err) {
        return err.message;
    }
};

exports.saveLog = async function(data_lama,data_baru,id_inventori,status) {
    try {
        let logInventori = new logModel();
        const arrPerubahanData = [];
        
        data_lama.invUnit != data_baru.unit_inventori && (data_baru.unit_inventori !== '' || data_baru.unit_inventori !== undefined) ? arrPerubahanData.push('Unit') : arrPerubahanData;
        data_lama.invRoom != data_baru.ruangan_inventori && (data_baru.ruangan_inventori !== '' || data_baru.ruangan_inventori !== undefined) ? arrPerubahanData.push('Ruangan') : arrPerubahanData;
        data_lama.invItem != data_baru.barang_inventori && (data_baru.barang_inventori !== '' || data_baru.barang_inventori !== undefined) ? arrPerubahanData.push('Barang') : arrPerubahanData;
        data_lama.invSize != data_baru.ukuran_inventori && (data_baru.ukuran_inventori !== '' || data_baru.ukuran_inventori !== undefined) ? arrPerubahanData.push('Ukuran') : arrPerubahanData;
        data_lama.invMerk != data_baru.merk_inventori && (data_baru.merk_inventori !== '' || data_baru.merk_inventori !== undefined) ? arrPerubahanData.push('Merk') : arrPerubahanData;
        data_lama.invTotal != data_baru.total_inventori && (data_baru.total_inventori !== '' || data_baru.total_inventori !== undefined) ? arrPerubahanData.push('Total') : arrPerubahanData;
        data_lama.invFoto != data_baru.foto_inventori && (data_baru.foto_inventori !== '' || data_baru.foto_inventori !== undefined) ? arrPerubahanData.push('Foto') : arrPerubahanData;
        data_lama.invCondition != data_baru.kondisi_inventori && (data_baru.kondisi_inventori !== '' || data_baru.kondisi_inventori !== undefined) ? arrPerubahanData.push('Kondisi') : arrPerubahanData;
        data_lama.invNote != data_baru.keterangan_inventori && (data_baru.keterangan_inventori !== '' || data_baru.keterangan_inventori !== undefined) ? arrPerubahanData.push('Keterangan') : arrPerubahanData;
        data_lama.invStatus != data_baru.status_inventori && (data_baru.status_inventori !== '' || data_baru.status_inventori !== undefined) ? arrPerubahanData.push('Status') : arrPerubahanData;
        
        if (arrPerubahanData.length !== 0) {
            logInventori.idInventori = id_inventori;
            logInventori.logActivity = 'Perubahan '+arrPerubahanData.toString();
            logInventori.logStatus = status;

            logInventori.save();
        }
            
    } catch (err) {
        return err.message;
    }
};

exports.getBarang = async function(idCategory,done) {
    try {
        let dataBarang = await mBarangModel.find({itemCategory:idCategory}).limit(1).sort({_id:-1}).exec();
        if (dataBarang.length === 0) {
            const objectBarang = {};
            done(objectBarang);
        } else {
            done(dataBarang[0]);
        }
    } catch (err) {
        return err.message;
    }
};
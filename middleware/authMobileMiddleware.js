const mUserModel = require('../models/tokenMobileModel');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let dataToken = await mUserModel.find({accessToken:token,active:true}).exec();
        
        if (dataToken.length !== 0)
        {
            next();
        } else {
            res.status(401).json({'statusCode':401,'message':'Unauthorized. Token Salah'});
        }
        
    } else {
        res.status(401).json({'statusCode':401,'message':'Unauthorized. Token Kosong'});
    }
};

module.exports = authenticateToken;
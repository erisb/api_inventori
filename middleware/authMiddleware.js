const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const mUserModel = require('../models/mUserModel');

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let dataToken = await mUserModel.find({accessToken:token}).exec();
        
        if (dataToken.length !== 0)
        {
            try {
                jwt.verify(token, process.env.ACCESS_JWT_SECRET);
                    
                next();

            } catch(e) {
                res.status(403).json({'statusCode':403,'message':'Forbidden'});
            }
            
        } else {
            res.status(401).json({'statusCode':401,'message':'Unauthorized. Token Salah'});
        }
        
    } else {
        res.status(401).json({'statusCode':401,'message':'Unauthorized. Token Kosong'});
    }
};

module.exports = authenticateJWT;
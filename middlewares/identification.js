const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) =>{
    let token;

    console.log("Headers:", req.headers);
    console.log("Authorization header:", req.headers.authorization);
    console.log("Client header:", req.headers.client);
    console.log("Cookies:", req.cookies);
    
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization
    }else{
        token = req.cookies['Authorization']
    }

    if(!token){
        return res.status(403).json({success: false, message: 'Unauthorized'})
    }
    try {
        const userToken = token.split(' ')[1]
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        if(jwtVerified) {
            req.user = jwtVerified;
            next();
        }else{
            throw new Error('Error verifying token');
        }
    }catch (error){
        console.log(error);
    }
}
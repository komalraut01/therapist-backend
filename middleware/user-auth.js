const jwt = require('jsonwebtoken');
exports.verifyUserToken = (req, res, next) => {
 let token = req.headers.authorization;
 if(!token) return res.status(401).send("Access Denied / Unauthorized request");

 try {

    token = token.split(" ")[1]

    if (token === 'null' || !token) return res.status(401).send('Unauthorized request');
    let verifiedUser = jwt.verify(token, 'user-secrets');
    if (!verifiedUser) return res.status(401).send('Unauthorized request')

    req.user = verifiedUser;
    next();
 }
 catch (error){
    console.log(error);
   return res.status(401).send("Invalid Token");
 }
}
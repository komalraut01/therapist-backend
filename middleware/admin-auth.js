const jwt = require('jsonwebtoken');
exports.verifyAdminToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");

    try {

        token = token.split(" ")[1]

        if (token === 'null' || !token) return res.status(401).send('Unauthorized request');
        let verifiedAdmin = jwt.verify(token, 'admin-secrets');
        if (!verifiedAdmin) return res.status(401).send('Unauthorized request')

        req.admin = verifiedAdmin;
        next();
    }
    catch (error) {
        return res.status(401).send("Invalid Token");
    }
}
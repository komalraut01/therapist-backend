const jwt = require('jsonwebtoken');
exports.verifyDoctorToken = (req, res, next) => {
   let token = req.headers.authorization;
   if (!token) return res.status(401).send("Access Denied / Unauthorized request");

   try {

      token = token.split(" ")[1]

      if (token === 'null' || !token) return res.status(401).send('Unauthorized request');
      let verifiedDoctor = jwt.verify(token, 'doctor-secrets');
      if (!verifiedDoctor) return res.status(401).send('Unauthorized request')

      req.doctor = verifiedDoctor;
      next();
   }
   catch (error) {
      return res.status(401).send("Invalid Token");
   }
}
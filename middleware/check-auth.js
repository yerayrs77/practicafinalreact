const jwt = require('jsonwebtoken')

const autorizacion = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed')
    }
    decodedToken = jwt.verify(token, 'clave_supermegasecreta');
    req.userData = {
      userId: decodedToken.userId
    }
    next();
  } catch (err) {
    const error = new Error('Authentication failed')
    error.code = 401;
    return next(error)
  }
}

module.exports = autorizacion;


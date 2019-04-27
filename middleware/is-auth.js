const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    // you can set any, we here use isAuth
    req.isAuth = false
    // leave the function, and request continues
    return next()
  }
  // Authorization: Bearer [toekn-value]
  const token = authHeader.split(' ')[1]
  if (!token) {
    req.isAuth = false
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, 'some-super-secret-key')
    if (!decodedToken) {
      req.isAuth = false
      return next()
    }
    // we have decoded token, we get the user id from the token safely
    req.isAuth = true
    req.userId = decodedToken.userId
    req.email = decodedToken.email
    next()
  } catch (err) {
    req.isAuth = false
    return next()
  }
}
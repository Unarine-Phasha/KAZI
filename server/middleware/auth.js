
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in.'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired login session.'
      })
    }

    req.user = user
    next()
  })
}

module.exports = authenticateToken

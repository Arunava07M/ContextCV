import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// this checks if the request has a valid token before letting it through
export const protect = async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // header looks like "Bearer <token>", so split and grab the token part
      token = authHeader.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // attach user to req so routes after this can use it
      // not sending password back obviously
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (err) {
      console.log('token verification failed:', err.message)
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token found' })
  }
}
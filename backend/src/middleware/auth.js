import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?.token
    const header = req.headers.authorization || ''
    const bearer = header.startsWith('Bearer ') ? header.slice(7) : null
    const token = cookieToken || bearer
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' })
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = payload
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    } else {
      return res.status(401).json({ error: 'Authentication failed' })
    }
  }
}


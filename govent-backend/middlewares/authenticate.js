import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Authentication middleware
export default function authenticate(req, res, next) {
  // Extract token from the 'auth_token' cookie
  const token = req.cookies['auth_token']

  // Log for debugging purposes
  console.log('Cookies:', req.cookies)
  console.log('Token extracted from cookie:', token)

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' })
  }

  try {
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid access token' })
  }
}

import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import User from '../models/user.model'
import config from '../../config/config'

// prettier-ignore
const signin = (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err || !user)
      return res.status(401).json({
        error: 'User not found.'
      })

    if (!user.authenticate(req.body.password))
      return res.status(401).json({
        error: "Email and password don't match."
      })

    // Generate a signed jwt for user.
    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    // Optional: Set token to cookie.
    res.cookie('t', token, {
      expire: new Date() + 9999
    })

    // Return all credentials to client.
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  })
}

// Only necessary if cookies are enabled on client.
const signout = (req, res) => {
  res.clearCookie('t')

  return res.status(200).json({
    message: 'Signed out.'
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id

  if (!authorized)
    return res.status(403).json({
      error: 'User is not authorized.'
    })

  next()
}

export default { signin, signout, requireSignin, hasAuthorization }

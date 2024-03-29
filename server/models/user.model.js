import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: 'Name is required' },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
    required: 'Email is required'
  },
  about: {
    type: String,
    trim: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  created: { type: Date, default: Date.now },
  updated: Date,
  hashed_password: { type: String, required: 'Password is required' },
  salt: String
})

// prettier-ignore
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

UserSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword(password) {
    if (!password) return ''

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt() {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  }
}

UserSchema.path('hashed_password').validate(function() {
  if (this._password && this._password.length < 6)
    this.invalidate('password', 'Password must be at least 6 characters')

  // prettier-ignore
  if (!this._password)
    this.invalidate('password', 'Password is required')
}, null)

export default mongoose.model('User', UserSchema)

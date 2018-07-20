import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

// prettier-ignore
router.route('/auth/signin')
  .post(authCtrl.signin)

// prettier-ignore
router.route('/auth/signout')
  .get(authCtrl.signout)

export default router

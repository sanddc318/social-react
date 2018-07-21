import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

// prettier-ignore
router.route('/api/users')
  .post(userCtrl.create)
  .get(userCtrl.list)

// prettier-ignore
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.remove
  )

// prettier-ignore
router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto)
// prettier-ignore
router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto)

// prettier-ignore
router.route('/api/users/follow')
  .put(
    authCtrl.requireSignin,
    userCtrl.addFollowing,
    userCtrl.addFollower
  )
// prettier-ignore
router.route('/api/users/unfollow')
  .put(
    auth.authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
  )

router.param('userId', userCtrl.userById)

export default router

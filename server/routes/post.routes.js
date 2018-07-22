import express from 'express'
import postCtrl from '../controllers/post.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// prettier-ignore
router.route('/api/posts/feed/:userId')
  .get(authCtrl.requireSignin, postCtrl.listNewsfeed)

// prettier-ignore
router.route('/api/posts/by/:userId')
  .get(authCtrl.requireSignin, postCtrl.listByUser)

router.param('userId', userCtrl.userById)

export default router

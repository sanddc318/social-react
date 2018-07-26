import express from 'express'
import postCtrl from '../controllers/post.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// prettier-ignore
router.route('/api/posts/new/:userId')
  .post(authCtrl.requireSignin, postCtrl.create)

// prettier-ignore
router.route('/api/posts/feed/:userId')
  .get(authCtrl.requireSignin, postCtrl.listNewsfeed)

// prettier-ignore
router.route('/api/posts/by/:userId')
  .get(authCtrl.requireSignin, postCtrl.listByUser)

// prettier-ignore
router.route('/api/posts/photo/:postId')
  .get(postCtrl.photo)

// prettier-ignore
router.route('/api/posts/like')
  .put(authCtrl.requireSignin, postCtrl.like)

// prettier-ignore
router.route('/api/posts/unlike')
  .put(authCtrl.requireSignin, postCtrl.unlike)

// prettier-ignore
router.route('/api/posts/comment')
  .put(authCtrl.requireSignin, postCtrl.comment)

// prettier-ignore
router.route('/api/posts/uncomment')
  .put(authCtrl.requireSignin, postCtrl.uncomment)

// prettier-ignore
router.route('/api/posts/:postId')
  .delete(
    authCtrl.requireSignin,
    postCtrl.isPoster,
    postCtrl.remove
  )

router.param('userId', userCtrl.userById)
router.param('postId', postCtrl.postById)

export default router

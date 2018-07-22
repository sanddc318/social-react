import formidable from 'formidable'
import fs from 'fs'
import Post from '../models/post.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })

    let post = new Post(fields)
    post.postedBy = req.profile

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }

    post.save((err, result) => {
      if (err)
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })

      res.json(result)
    })
  })
}

const postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .exec((err, post) => {
      if (err || !post)
        return res.status(400).json({
          error: 'Post not found.'
        })

      req.post = post
      next()
    })
}

const isPoster = (req, res, next) => {
  // console.log('post', typeof req.post.postedBy._id)
  // console.log('auth', typeof req.auth._id)
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id

  if (!isPoster)
    return res.status(403).json({
      error: 'User is not authorized'
    })

  next()
}

const remove = (req, res, next) => {
  let post = req.post

  post.remove((err, deletedPost) => {
    if (err)
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })

    res.json(deletedPost)
  })
}

const listNewsfeed = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)

  Post.find({ postedBy: { $in: req.profile.following } })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err)
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })

      res.json(posts)
    })
}

const listByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err)
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })

      res.json(posts)
    })
}

const photo = (req, res, next) => {
  res.set('Content-Type', req.post.photo.contentType)
  return res.send(req.post.photo.data)
}

export default {
  create,
  postById,
  isPoster,
  remove,
  listNewsfeed,
  listByUser,
  photo
}

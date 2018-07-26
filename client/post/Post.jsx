import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui-icons/Delete'
import FavoriteIcon from 'material-ui-icons/Favorite'
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import CommentIcon from 'material-ui-icons/Comment'
import Divider from 'material-ui/Divider'
import Comments from './Comments.jsx'
import auth from './../auth/auth-helper'
import { remove, like, unlike } from './api-post.js'

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: '0 auto',
    marginBottom: theme.spacing.unit * 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)'
  },
  cardContent: {
    backgroundColor: 'white',
    padding: `${theme.spacing.unit * 2}px 0px`
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  cardActions: {
    margin: 0,
    padding: 0
  },
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: 'center',
    padding: theme.spacing.unit
  },
  media: {
    height: 200,
    padding: theme.spacing.unit
  },
  button: {
    margin: 0
  }
})

class Post extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
  }

  componentDidMount() {
    const { likes, comments } = this.props.post

    this.setState({
      like: this.checkLike(likes),
      likes: likes.length,
      comments: comments
    })
  }

  componentWillReceiveProps(props) {
    const { likes, comments } = props.post

    this.setState({
      like: this.checkLike(likes),
      likes: likes.length,
      comments: comments
    })
  }

  removePost = () => {
    const jwt = auth.isAuthenticated()

    remove({ postId: this.props.post._id }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.props.onRemovePost(this.props.post)
      }
    })
  }

  checkLike = (likes) => {
    const jwt = auth.isAuthenticated()
    let userAlreadyLiked = likes.indexOf(jwt.user._id) !== -1

    return userAlreadyLiked
  }

  like = () => {
    let callApi = this.state.like ? unlike : like
    const jwt = auth.isAuthenticated()

    callApi(
      { userId: jwt.user._id },
      { t: jwt.token },
      this.props.post._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ like: !this.state.like, likes: data.likes.length })
      }
    })
  }

  handleUpdateComments = (comments) => {
    this.setState({ comments: comments })
  }

  render() {
    const { classes } = this.props
    const { postedBy, created, _id, photo, text } = this.props.post

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={`/api/users/photo/${postedBy._id}`} />}
          action={
            postedBy._id === auth.isAuthenticated().user._id && (
              <IconButton onClick={this.removePost}>
                <DeleteIcon />
              </IconButton>
            )
          }
          title={<Link to={`/user/${postedBy._id}`}>{postedBy.name}</Link>}
          subheader={new Date(created).toDateString()}
          className={classes.cardHeader}
        />

        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.text}>
            {text}
          </Typography>

          {photo && (
            <div className={classes.photo}>
              <Divider />
              <img
                className={classes.media}
                src={`/api/posts/photo/${_id}`}
                alt="Photo accompanying user's post."
              />
            </div>
          )}
        </CardContent>

        <CardActions className={classes.cardActions}>
          {this.state.like ? (
            <IconButton
              className={classes.button}
              aria-label="Like"
              color="secondary"
              onClick={this.like}>
              <FavoriteIcon />
            </IconButton>
          ) : (
            <IconButton
              className={classes.button}
              aria-label="Unlike"
              color="secondary"
              onClick={this.like}>
              <FavoriteBorderIcon />
            </IconButton>
          )}
          <span>{this.state.likes}</span>

          <IconButton
            className={classes.button}
            aria-label="Comment"
            color="secondary">
            <CommentIcon />
          </IconButton>
          <span>{this.state.comments.length}</span>
        </CardActions>
        <Divider />

        <Comments
          postId={_id}
          comments={this.state.comments}
          onUpdateComments={this.handleUpdateComments}
        />
      </Card>
    )
  }
}
Post.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  onRemovePost: PropTypes.func.isRequired
}

export default withStyles(styles)(Post)

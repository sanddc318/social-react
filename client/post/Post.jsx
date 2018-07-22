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
  text: {
    margin: theme.spacing.unit * 2
  },
  photo: {
    textAlign: 'center',
    padding: theme.spacing.unit
  },
  media: {
    height: 200
  },
  button: {
    margin: theme.spacing.unit
  }
})

class Post extends Component {
  state = {
    like: false,
    likes: 0,
    comments: []
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
              <img
                className={classes.media}
                src={`/api/posts/photo/${_id}`}
                alt="Photo accompanying user's post."
              />
            </div>
          )}
        </CardContent>

        <CardActions>
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

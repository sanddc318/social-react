import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import { listNewsfeed } from './api-post.js'
// import NewPost from './NewPost.jsx'
import PostList from './PostList.jsx'

const styles = (theme) => ({
  card: {
    margin: '0 auto',
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 3
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
})

class Newsfeed extends Component {
  state = {
    posts: []
  }

  loadPosts = () => {
    const jwt = auth.isAuthenticated()

    listNewsfeed({ userId: jwt.user._id }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
      }
    })
  }

  componentDidMount() {
    this.loadPosts()
  }

  handleAddPost = (post) => {
    const updatedPosts = this.state.posts

    updatedPosts.unshift(post)
    this.setState({ posts: updatedPosts })
  }

  handleRemovePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)

    updatedPosts.splice(index, 1)
    this.setState({ posts: updatedPosts })
  }

  render() {
    return (
      <Card>
        <Typography type="title">Newsfeed</Typography>

        <Divider />

        {/*<NewPost onAddPost={this.handleAddPost} />*/}

        <Divider />

        <PostList
          onRemovePost={this.handleRemovePost}
          posts={this.state.posts}
        />
      </Card>
    )
  }
}
Newsfeed.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Newsfeed)

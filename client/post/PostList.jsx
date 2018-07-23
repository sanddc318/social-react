import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Post from './Post.jsx'
import auth from '../auth/auth-helper'

const styles = (theme) => ({
  text: {
    textAlign: 'center'
  }
})

class PostList extends Component {
  render() {
    const { classes } = this.props
    let userContext = ''

    // Only true when ProfileTabs renders PostList.
    if (this.props.user) {
      userContext =
        this.props.user._id === auth.isAuthenticated().user._id
          ? 'You have no posts.'
          : 'This user has no posts.'
    } else {
      userContext = 'Your feed is empty. Make a post or add some friends.'
    }

    return (
      <div style={{ marginTop: '24px' }}>
        {this.props.posts.length === 0 ? (
          <Typography component="p" className={classes.text}>
            {userContext}
          </Typography>
        ) : (
          this.props.posts.map((post, index) => {
            return (
              <Post
                post={post}
                key={index}
                onRemovePost={this.props.onRemovePost}
              />
            )
          })
        )}
      </div>
    )
  }
}
PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onRemovePost: PropTypes.func.isRequired
}

export default withStyles(styles)(PostList)

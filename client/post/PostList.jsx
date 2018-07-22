import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Post from './Post.jsx'
import auth from '../auth/auth-helper'

class PostList extends Component {
  render() {
    let userContext = ''

    // Only true when ProfileTabs renders PostList.
    if (this.props.user) {
      userContext =
        this.props.user._id === auth.isAuthenticated().user._id
          ? 'You have'
          : 'This user has'
    }

    return (
      <div style={{ marginTop: '24px' }}>
        {this.props.posts.length === 0 ? (
          <p style={{ textAlign: 'center' }}>{userContext} no posts.</p>
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

export default PostList

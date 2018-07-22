import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Post from './Post.jsx'

class PostList extends Component {
  render() {
    return (
      <div style={{ marginTop: '24px' }}>
        {this.props.posts.map((post, index) => {
          return (
            <Post
              post={post}
              key={index}
              onRemovePost={this.props.onRemovePost}
            />
          )
        })}
      </div>
    )
  }
}
PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onRemovePost: PropTypes.func.isRequired
}

export default PostList

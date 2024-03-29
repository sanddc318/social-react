import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import { unfollow, follow } from './api-user.js'

class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow)
  }

  unfollowClick = () => {
    this.props.onButtonClick(unfollow)
  }

  render() {
    return (
      <React.Fragment>
        {this.props.following ? (
          <Button
            variant="raised"
            color="secondary"
            onClick={this.unfollowClick}>
            Unfollow
          </Button>
        ) : (
          <Button variant="raised" color="primary" onClick={this.followClick}>
            Follow
          </Button>
        )}
      </React.Fragment>
    )
  }
}
FollowProfileButton.propTypes = {
  following: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired
}

export default FollowProfileButton

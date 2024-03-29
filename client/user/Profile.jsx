import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Divider from 'material-ui/Divider'
import auth from '../auth/auth-helper'
import DeleteUser from './DeleteUser.jsx'
import FollowProfileButton from './FollowProfileButton.jsx'
import ProfileTabs from './ProfileTabs.jsx'
import { read } from './api-user'
import { listByUser } from '../post/api-post'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
    color: theme.palette.protectedTitle,
    fontSize: '1em'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
})

class Profile extends Component {
  constructor({ match }) {
    super()

    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: '',
      posts: []
    }

    this.match = match
  }

  init = (userId) => {
    const jwt = auth.isAuthenticated()

    read({ userId: userId }, { t: jwt.token }).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        let following = this.checkIfFollowing(data)
        console.log(following)

        this.setState({ user: data, following: following })
        this.loadPosts(data._id)
      }
    })
  }

  componentWillReceiveProps(props) {
    this.init(props.match.params.userId)
  }

  componentDidMount() {
    this.init(this.match.params.userId)
  }

  checkIfFollowing = (user) => {
    const jwt = auth.isAuthenticated()
    const match = user.followers.find((follower) => {
      return follower._id == jwt.user._id
    })

    return match || false
  }

  handleFollowButtonClick = (callApi) => {
    const jwt = auth.isAuthenticated()

    callApi(
      { userId: jwt.user._id },
      { t: jwt.token },
      this.state.user._id
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ user: data, following: !this.state.following })
      }
    })
  }

  loadPosts = (user) => {
    const jwt = auth.isAuthenticated()

    listByUser({ userId: user }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
      }
    })
  }

  handleRemovePost = (post) => {
    const updatedPosts = this.state.posts
    const index = updatedPosts.indexOf(post)

    updatedPosts.splice(index, 1)
    this.setState({ posts: updatedPosts })
  }

  render() {
    const { classes } = this.props
    const redirectToSignin = this.state.redirectToSignin
    const photoUrl = this.state.user._id
      ? `/api/users/photo/${this.state.user._id}?${new Date().getTime()}`
      : '/api/users/defaultphoto'

    if (redirectToSignin) return <Redirect to="/signin" />

    return (
      // prettier-ignore
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Profile
        </Typography>

        <List dense>
          <ListItem>
            <ListItemAvatar className={classes.bigAvatar}>
              <Avatar src={photoUrl} />
            </ListItemAvatar>

            <ListItemText
              primary={this.state.user.name}
              secondary={this.state.user.email}
            />

            {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == this.state.user._id ? (
              <ListItemSecondaryAction>
                <Link to={`/user/edit/${this.state.user._id}`}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit />
                  </IconButton>
                </Link>

                <DeleteUser userId={this.state.user._id} />
              </ListItemSecondaryAction>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.handleFollowButtonClick}
              />
            )}
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText primary={this.state.user.about} />
          </ListItem>
          <ListItem>
            {/* prettier-ignore */}
            <ListItemText
              secondary={
                `Joined: ${new Date(this.state.user.created).toDateString()}`
              }
            />
          </ListItem>
        </List>

        <ProfileTabs user={this.state.user} posts={this.state.posts} onRemovePost={this.handleRemovePost} />
      </Paper>
    )
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)

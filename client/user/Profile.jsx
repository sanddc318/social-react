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
import { read } from './api-user'
import DeleteUser from './DeleteUser.jsx'
import FollowProfileButton from './FollowProfileButton.jsx'
import FollowGrid from './FollowGrid.jsx'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `0 0 ${theme.spacing.unit * 2}px`,
    color: theme.palette.protectedTitle
  }
})

class Profile extends Component {
  constructor({ match }) {
    super()

    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: ''
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
        this.setState({ user: data, following: following })
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
            <ListItemAvatar>
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

          <Divider />

          Followers
          <FollowGrid people={this.state.user.followers} />
          Following
          <FollowGrid people={this.state.user.following} />
        </List>
      </Paper>
    )
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)

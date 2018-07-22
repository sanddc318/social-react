import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Snackbar from 'material-ui/Snackbar'
import ViewIcon from 'material-ui-icons/Visibility'
import auth from '../auth/auth-helper'
import { findPeople, follow } from './api-user.js'

const styles = (theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing.unit,
    margin: 0
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing
      .unit * 2}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  avatar: {
    marginRight: theme.spacing.unit * 1
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  },
  viewButton: {
    verticalAlign: 'middle'
  }
})

class FindPeople extends Component {
  state = {
    users: [],
    open: false,
    error: '',
    followMessage: ''
  }

  componentDidMount() {
    const jwt = auth.isAuthenticated()

    findPeople({ userId: jwt.user._id }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ users: data })
      }
    })
  }

  handleFollowClick = (user, index) => {
    const jwt = auth.isAuthenticated()

    follow({ userId: jwt.user._id }, { t: jwt.token }, user._id).then(
      (data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          let usersNotFollowed = this.state.users

          usersNotFollowed.splice(index, 1)
          this.setState({
            users: usersNotFollowed,
            open: true,
            followMessage: `Following ${user.name}`
          })
        }
      }
    )
  }

  handleRequestToClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Paper className={classes.root} elevation={4}>
          <Typography className={classes.title} type="title">
            Who To Follow
          </Typography>

          <List>
            {this.state.users
              .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
              .map((user, index) => {
                return (
                  <span key={index}>
                    <ListItem>
                      <ListItemAvatar className={classes.avatar}>
                        <Avatar src={`/api/users/photo/${user._id}`} />
                      </ListItemAvatar>

                      <ListItemText primary={user.name} />

                      <ListItemSecondaryAction className={classes.follow}>
                        <Link to={`/user/${user._id}`}>
                          <IconButton
                            variant="raised"
                            color="secondary"
                            className={classes.viewButton}>
                            <ViewIcon />
                          </IconButton>
                        </Link>

                        <Button
                          aria-label="Follow"
                          variant="raised"
                          color="primary"
                          onClick={this.handleFollowClick.bind(
                            this,
                            user,
                            index
                          )}>
                          Follow
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </span>
                )
              })}
          </List>
        </Paper>

        <Snackbar
          anchorOrigin={{ verticle: 'bottom', horizantal: 'right' }}
          open={this.state.open}
          onClose={this.handleRequestToClose}
          autoHideDuration={6000}
          message={
            <span className={classes.snack}>{this.state.followMessage}</span>
          }
        />
      </React.Fragment>
    )
  }
}
FindPeople.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FindPeople)

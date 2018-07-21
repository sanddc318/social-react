import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import auth from '../auth/auth-helper'
import { remove } from './api-user.js'

class DeleteUser extends Component {
  state = {
    redirect: false,
    open: false
  }

  handleDeleteButtonClick = () => this.setState({ open: true })

  handleRequestToClose = () => this.setState({ open: false })

  deleteAccount = () => {
    const jwt = auth.isAuthenticated()

    remove({ userId: this.props.userId }, { t: jwt.token }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        auth.signout(() => console.log('Deleted.'))
        this.setState({ redirect: true })
      }
    })
  }

  render() {
    const redirect = this.state.redirect

    if (redirect) return <Redirect to="/" />

    return (
      <React.Fragment>
        <IconButton
          aria-label="Delete"
          onClick={this.handleDeleteButtonClick}
          color="secondary">
          <DeleteIcon />
        </IconButton>

        <Dialog open={this.state.open} onClose={this.handleRequestToClose}>
          <DialogTitle>Delete Account</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Confirm to delete your account.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleRequestToClose} color="primary">
              Cancel
            </Button>

            <Button onClick={this.deleteAccount} color="secondary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}
export default DeleteUser

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import FileUpload from 'material-ui-icons/FileUpload'
import Avatar from 'material-ui/Avatar'
import auth from '../auth/auth-helper'
import { read, update } from './api-user.js'

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: '0 auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: '0 auto',
    marginBottom: theme.spacing.unit * 2
  },
  filename: {
    marginLeft: '10px'
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: '0 auto'
  }
})

class EditProfile extends Component {
  constructor({ match }) {
    super()

    this.state = {
      photo: '',
      name: '',
      email: '',
      password: '',
      about: '',
      redirectToProfile: false,
      error: ''
    }

    this.match = match
  }

  componentDidMount() {
    this.userData = new FormData()
    const jwt = auth.isAuthenticated()

    read({ userId: this.match.params.userId }, { t: jwt.token }).then(
      (data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({
            id: data._id,
            name: data.name,
            email: data.email,
            about: data.about
          })
        }
      }
    )
  }

  handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value

    this.userData.set(name, value)
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    const jwt = auth.isAuthenticated()

    update(
      { userId: this.match.params.userId },
      { t: jwt.token },
      this.userData
    ).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ redirectToProfile: true })
      }
    })
  }

  render() {
    const { classes } = this.props
    const photoUrl = this.state.id
      ? `/api/users/photo/${this.state.id}?${new Date().getTime()}` // Bypass browser cache.
      : `/api/users/defaultphoto`

    if (this.state.redirectToProfile)
      // HAD TO LEAVE A COMMENT FOR THIS RETURN STATEMENT
      // HOURS UPON HOURS WASTED!
      // AAAAAHHHHH! SO DAMN MAD!
      // NEVER AGAIN. IT'S ALWAYS A TYPO!!!
      // WILL DELETE NEXT COMMIT ... MAYBE
      return <Redirect to={`/user/${this.state.id}`} />

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Profile
          </Typography>

          <Avatar src={photoUrl} className={classes.bigAvatar} />
          <br />
          <input
            type="file"
            accept="image/*"
            id="icon-button-file"
            style={{ display: 'none' }}
            onChange={this.handleChange('photo')}
          />
          <label htmlFor="icon-button-file">
            <Button variant="raised" color="default" component="span">
              Upload <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>
            {this.state.photo ? this.state.photo.name : ''}
          </span>
          <br />

          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <br />
          <TextField
            id="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange('email')}
            margin="normal"
          />
          <br />
          <TextField
            id="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange('password')}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="About You"
            multiline
            className={classes.textField}
            placeholder="Please give a brief description of yourself."
            value={this.state.about}
            onChange={this.handleChange('about')}
            margin="normal"
          />
          <br />
          {this.state.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {this.state.error}
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button
            color="primary"
            variant="raised"
            onClick={this.handleSubmit}
            className={classes.submit}>
            Submit
          </Button>
        </CardActions>
      </Card>
    )
  }
}
EditProfile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditProfile)

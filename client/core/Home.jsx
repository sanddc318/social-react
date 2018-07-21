import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import FindPeople from '../user/FindPeople.jsx'
import beachPhoto from '../assets/images/beach-view.jpeg'
import auth from '../auth/auth-helper'

const styles = (theme) => ({
  card: {
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing.unit * 5
  },
  title: {
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme
      .spacing.unit * 2}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 330
  }
})

class Home extends Component {
  state = {
    defaultPage: true
  }

  init = () => {
    if (auth.isAuthenticated()) {
      this.setState({ defaultPage: false })
    } else {
      this.setState({ defaultPage: true })
    }
  }

  componentWillReceiveProps() {
    this.init()
  }

  componentDidMount() {
    this.init()
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Card className={classes.card}>
          <Typography type="headline" component="h2" className={classes.title}>
            Home Page
          </Typography>

          <CardMedia
            className={classes.media}
            image={beachPhoto}
            title="Beach View"
          />

          <CardContent>
            <Typography type="body1" component="p">
              Welcome. Here's a nice photo for you to look at.
            </Typography>
          </CardContent>
        </Card>

        {!this.state.defaultPage && <FindPeople />}
      </React.Fragment>
    )
  }
}
Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)

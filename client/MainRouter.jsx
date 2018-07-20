import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Menu from './core/Menu.jsx'
import Home from './core/Home.jsx'
import Users from './user/Users.jsx'
import Signup from './user/Signup.jsx'
import Signin from './auth/Signin.jsx'
import Profile from './user/Profile.jsx'
import PrivateRoute from './auth/PrivateRoute.jsx'
import EditProfile from './user/EditProfile.jsx'

class MainRouter extends Component {
  // Remove server-side injected CSS; take control.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')

    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles)
  }

  render() {
    return (
      <React.Fragment>
        <Menu />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />
        </Switch>
      </React.Fragment>
    )
  }
}

export default MainRouter

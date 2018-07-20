import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth-helper'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      // If authenticated, show protected component.
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        // Otherwise, redirect to signin page.
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

export default PrivateRoute

import React from 'react'
// import { render } from 'react-dom'
import { hydrate } from 'react-dom' // Used because of SSR.
import App from './App.jsx'

hydrate(<App />, document.getElementById('root'))

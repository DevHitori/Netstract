//client/routes.js
import React, {Component} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import home from './pages/Home';


class Routes extends Component {

 render() {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={home} />
        <Route exact path='/home' component={home} />
        <Route exact path='/video' component={home} />
        <Route exact path='/api' component={home} />
        <Route exact path='/login' component={home} />
        <Route exact path='/signup' component={home} />
        <Redirect to="/"/>
      </Switch>
    </div>
    )
  }
}
export default Routes;

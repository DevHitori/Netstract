//client/components/Home.js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom'
import {Link,Route, Switch, Redirect, withRouter} from 'react-router-dom'
import { Button, Form , Spinner } from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import queryString from 'query-string';
import Menu from '../components/Menu';
import Api from './Api';
import Video from './Video';
import ContactUs from './ContactUs';
import Login from './Login';
import Signup from './Signup';
import worldVector from '../images/worldVector.png'



function home(props) {
  return(<div className="homeDiv">
    <h1 className="homeTitle" >Welcome to Netstract</h1>
    <h2 className="homeMessage">Netstract is an open source api with the purpose of providing flexiable extraction methods for any video, image or data on the internet!</h2>
    <div className="worldVectorDiv"><img className="worldVector" src={worldVector} alt="signinButton"/></div>
    </div>
  )
}





export default class Home extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      user: "",
      token:null
    };


  }

  componentDidMount() {
    const parsed = queryString.parse(location.search);
    const obj = getFromStorage('netstract');
    if (obj && obj.token) {
      const { token } = obj;
      fetch('/api/user/check?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            fetch(`/api/user/data?id=${json.message}`)
              .then(res => res.json())
              .then(response => {
                if (response.success) {
                console.log(response.user);
                this.setState({
                  user: response.user,
                  isLoading: false});
                }else{
              console.log(response.message);
              this.setState({
                isLoading: false,
              });
            }
          });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }







  render() {
    const {
      isLoading,
      token,
      discordUser
    } = this.state;






    return(<div className="background">
      <Menu user={this.state.user}/>
          <Route exact path='/' component={home} />
          <Route path='/video' component={Video} />
          <Route path='/api' component={Api} />
          <Route path='/contactus' component={ContactUs} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
      </div>)

}
}

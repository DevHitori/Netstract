//client/components/Home.js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom'
import { Button , Form, Spinner} from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import queryString from 'query-string';


export default class Home extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      LoginMsg: null
    };


    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){

  }

  handleSubmit(event){
    event.preventDefault();
    var { email, password } = this.state;
    fetch(`/api/user?email=${email}&password=${password}`,{method: 'GET'})
    .then(res => res.json())
    .then(response => {
      console.log(response);
      if (response.success) {
      setInStorage('netstract', {token: response.token});
      window.location.replace(`/`);
    }else{
      this.setState({
        LoginMsg: response.message
      });
    }
    })
  }

  handleChange(event) {
    if(event.target.id =='formBasicEmail'){
      this.setState({
        email: event.target.value,
        LoginMsg: ''
      });
    }else if(event.target.id =='formBasicPassword'){
      this.setState({
        password: event.target.value
      });
    }
  }




  render() {

    const {
      isLoading,
    } = this.state;



      return(
        <div className="background2 page">
        <Form className="formGroup1" onSubmit={this.handleSubmit}>
        <h1 className="formGroup1-Header">Login</h1>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control value={this.state.email} onChange={this.handleChange} type="text" placeholder="Email"/>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control value={this.state.password} onChange={this.handleChange}type="password" placeholder="Password" />
          </Form.Group>
        <Form.Group controlId="formBasicChecbox">
          <Form.Check type="checkbox" label="Keep me logged in"/>
        </Form.Group>
        <Button variant="primary" type="submit">Log In</Button> {this.state.LoginMsg ? <p className ="LoginMsg">{this.state.LoginMsg}</p> : null }
        <Form.Text className="text-muted formGroup1-Footer">Don't have an account? <Link to="/signup">Sign Up.</Link></Form.Text>
      </Form>
      </div>
    )
    }

}

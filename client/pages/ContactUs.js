//client/components/Home.js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Link, withRouter} from 'react-router-dom'
import { Button,ButtonToolbar, Form, Overlay, OverlayTrigger,Tooltip } from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import queryString from 'query-string';
import * as EmailValidator from 'email-validator';

function Check(props) {
  const state = props.state;
  const msg = props.msg;
  if (state==0) {return (
    <OverlayTrigger
      key='left'
      placement='left'
      overlay={
        <Tooltip id={`tooltip-left`}>
          {msg}
        </Tooltip>
      }
    >
      <i style={{color:'red'}} className="fas fa-times controlMsg"></i>
    </OverlayTrigger>
  )}else if(state==1){return (
    <OverlayTrigger
      key='left'
      placement='left'
      overlay={
        <Tooltip id={`tooltip-left`}>
          {msg}
        </Tooltip>
      }
    >
      <i style={{color:'green'}} className="fas fa-check controlMsg"></i>
    </OverlayTrigger>
  )}else if(state==2){return (
    <OverlayTrigger
      key='left'
      placement='left'
      overlay={
        <Tooltip id={`tooltip-left`}>
          {msg}
        </Tooltip>
      }
    >
      <i style={{color:'grey'}}  className="fas fa-question-circle controlMsg"></i>
    </OverlayTrigger>
  )}

}



export default class Home extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      token:null,
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      usernameMsg: 'Enter Username',
      emailMsg: 'Enter Email',
      passwordMsg: 'Enter Password',
      confirmPasswordMsg: 'Confirm Password',
      usernameState: 2,
      emailState: 2,
      passwordState: 2,
      confirmPasswordState: 2,
      agreedTOSState: 2
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.signUp = this.signUp.bind(this);
    // this.signUpWithDiscord = this.singUpWithDiscord.bind(this);
  }

  componentDidMount(){
    const parsed = queryString.parse(location.search);
    var username = parsed.username || "";
    var email = parsed.email || "";
    this.setState({
      username: username,
      email: email
    })
  }


  handleSubmit(event) {
    event.preventDefault();
    var { usernameState , emailState , passwordState , confirmPasswordState , agreedTOSState} = this.state;
    if (usernameState == 1 && emailState== 1 && passwordState==1 && confirmPasswordState==1 && agreedTOSState==1) {
      console.log('gg');
    }else{
      console.log('rip');
    }
  }


  handleChange(event) {
    if(event.target.id =='formBasicUsername'){
      //axios.check
      this.setState({
        username: event.target.value
      });
    }else if(event.target.id =='formBasicEmail'){
      this.setState({
        email: event.target.value
      });
      if (event.target.value =='' || event.target.value == null) {
        this.setState({
          emailState: 2,
          emailMsg: 'Enter Email',
        });
      }else if (EmailValidator.validate(event.target.value)) {
        //check to see if exist
        //this.setState({
        //  emailState: 0,
        //  emailMsg: 'Email Already Exist',
        //});
        this.setState({
          emailState: 1,
          emailMsg: 'Valid',
        });
      }else{
        this.setState({
          emailState: 0,
          emailMsg: 'Invalid Email',
        });
      }
    }else if(event.target.id =='formBasicPassword'){
      this.setState({
        password: event.target.value
      });
      if (this.state.confirmpassword == "" || this.state.confirmpassword == null) {
        this.setState({
          confirmPasswordMsg: 'Confirm Password',
          confirmPasswordBool: 2
        });
      }else if(event.target.value == this.state.confirmpassword){
        this.setState({
          confirmPasswordMsg: 'Passwords Match',
          confirmPasswordBool: 1
        });
      }else{
        this.setState({
          confirmPasswordMsg: 'Passwords Don\'t Match',
          confirmPasswordState: 0
        });
      }
    }else if(event.target.id =='formBasicConfirmPassword'){
      this.setState({
        confirmpassword: event.target.value
      });
      if (event.target.value == "" || event.target.value == null) {
        this.setState({
          confirmPasswordMsg: 'Confirm Password',
          confirmPasswordState: 2
        });
      }else if(event.target.value == this.state.password ){
        this.setState({
          confirmPasswordMsg: 'Passwords Match',
          confirmPasswordState: 1
        });
      }else{
        this.setState({
          confirmPasswordMsg: 'Passwords Don\'t Match',
          confirmPasswordState: 0
        });
      }
    }
}





  render() {

    const {
      isLoading,
      token,
      discordUser
    } = this.state;







      return(<div className="background2 page">
            <Form onSubmit={this.handleSubmit} className="formGroup1">
            <h1 className="formGroup1-Header">Signup</h1>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Check msg={this.state.usernameMsg} state={this.state.usernameState}/>
                <Form.Control value={this.state.username} onChange={this.handleChange} type="text" placeholder="Username" />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Check msg={this.state.emailMsg} state={this.state.emailState}/>
                <Form.Control value={this.state.email} onChange={this.handleChange} type="email" placeholder="Email" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Check msg={this.state.passwordMsg} state={this.state.passwordState}/>
                <Form.Control value={this.state.password} onChange={this.handleChange} type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <OverlayTrigger key='left' placement='left' overlay={<Tooltip id="tooltip-left">Tooltip!</Tooltip>}>
                <Check msg={this.state.confirmPasswordMsg} state={this.state.confirmPasswordState}/>
                </OverlayTrigger>
                <Form.Control value={this.state.confirmpassword} onChange={this.handleChange} type="password" placeholder="Repeat Password" />
              </Form.Group>
              <Form.Group controlId="formBasicChecbox">
                <Form.Check type="checkbox" label="I read and Agree to the Terms and Agreements" />
              </Form.Group>
              <Button variant="primary" type="submit">Sign up</Button>
              <Form.Text className="text-muted formGroup1-Footer">Already have an account? <Link to="/login">Login.</Link></Form.Text>
            </Form>


    <OverlayTrigger
      key='left'
      placement='left'
      overlay={
        <Tooltip id={`tooltip-left`}>
          Tooltip on <strong>left</strong>.
        </Tooltip>
      }
    >
      <i style={{color:'grey'}}  className="fas fa-question-circle controlMsg"></i>
    </OverlayTrigger>

          </div>
      )
      }

}

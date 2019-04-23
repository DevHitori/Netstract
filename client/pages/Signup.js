import React from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter} from 'react-router-dom'
import { Button,ButtonToolbar, Form, Overlay, OverlayTrigger,Tooltip } from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import queryString from 'query-string';

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
      email: "",
      password: "",
      confirmpassword: "",
      emailMsg: 'Enter Email',
      passwordMsg: 'Enter Password',
      confirmPasswordMsg: 'Confirm Password',
      emailState: 2,
      passwordState: 2,
      confirmPasswordState: 2,
      tosAgreement: 0,
      signUpMsg:null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.signUp = this.signUp.bind(this);
    // this.signUpWithDiscord = this.singUpWithDiscord.bind(this);
  }

  componentDidMount(){
  }


  handleSubmit(event) {
    event.preventDefault();
    var { emailState , passwordState , confirmPasswordState ,email,password, tosAgreement} = this.state;
    if (emailState == 1 && passwordState==1 && confirmPasswordState==1 && tosAgreement==1) {
      fetch(`/api/user?email=${email}&password=${password}&tos=${tosAgreement}`,{method: 'POST'})
           .then(res => res.json())
           .then(json => {
             console.log(json.success);
             if (json.success) {
            this.setState({
              signUpMsg: "Successfully Signed Up"
              });
             setInStorage('netstract', {token: json.token});
             window.location.replace(`/`);
           }else{
             this.setState({
               signUpMsg: "Server Error"
             });
           }
            });
    }else{
      this.setState({
        signUpMsg: "Fill out all fields"
      });
    }
  }


  handleChange(event) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(event.target.id =='formBasicEmail'){
      this.setState({
        email: event.target.value
      });
      if (event.target.value =='' || event.target.value == null) {
        this.setState({
          emailState: 2,
          emailMsg: 'Enter Email',
        });
      }else if (event.target.value.match(emailRegex)) {
      fetch(`/api/user/email?email=${event.target.value}`,{method: 'GET'})
      .then(res => res.json())
      .then(response => {
        if (response.success) {
        this.setState({
          emailState: response.success,
          emailMsg: response.message,
        });
      }else{
        this.setState({
          emailState: 0,
          emailMsg: 'Server Error1',
        });
      }
      })
      .catch(function (error) {
        this.setState({
          emailState: 0,
          emailMsg: 'Server Error',
        });
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
      if(event.target.value=="" || event.target.value== null){
        this.setState({
          passwordMsg: 'Enter Password',
          passwordState: 2
        });
      }else if(event.target.value.length<5){
        this.setState({
          passwordMsg: 'Password needs to be longer than 5 characters',
          passwordState: 0
        });
      }else{
        this.setState({
          passwordMsg: 'Valid',
          passwordState: 1
        });
      }
      if (this.state.confirmpassword == "" || this.state.confirmpassword == null) {
        this.setState({
          confirmPasswordMsg: 'Confirm Password',
          confirmPasswordState: 2
        });
      }else if(event.target.value == this.state.confirmpassword){
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

      return(<div className="background2">
            <Form onSubmit={this.handleSubmit} className="formGroup1">
            <h1 className="formGroup1-Header">Signup</h1>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Check msg={this.state.emailMsg} state={this.state.emailState}/>
                <Form.Control value={this.state.email} onChange={this.handleChange} type="text" placeholder="Email" />
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
              <Form.Group controlId="formBasicTOS">
                <Form.Check onClick={()=>{this.state.tosAgreement = this.state.tosAgreement==1 ? 0 : 1 }} type="checkbox" label="I have read and agree to the Terms and Conditions and Privacy Policy" />
              </Form.Group>
              <Button variant="primary" type="submit">Sign up</Button> {this.state.signUpMsg ? <p className ="signUpMsg">{this.state.signUpMsg}</p> : null }
              <Form.Text className="text-muted formGroup1-Footer">Already have an account? <Link to="/login">Login.</Link></Form.Text>
            </Form>
          </div>
      )
      }

}

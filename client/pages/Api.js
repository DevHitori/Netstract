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
      token:null,
      email: ""
    };


    // this.signUp = this.signUp.bind(this);
  }

  componentDidMount(){

  }




  render() {

    const {
      isLoading,
      token,
      discordUser
    } = this.state;



      return(
        <div className="background2 page">

      </div>
    )
    }

}

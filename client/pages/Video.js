//client/components/Home.js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { Button, Form, InputGroup, Col } from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import VideoOptions from '../components/VideoOptions';
import videoNetstractMessage from '../images/VideoNetstractMessage.png'
import thumbnail from '../images/thumbnail.png'
import thumbnailTape from '../images/thumbnailTape.png'
import selectedButton from '../images/selectedButton.png'



export default class Video extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      LinkInput: "",
      videoInfo: null,
      videoInfoLoading: false,
      videoFailMessage: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleGetInfo = this.handleGetInfo.bind(this);
  }

handleGetInfo(){
  this.setState({
    videoInfoLoading: true,
    videoInfo: null,
  })
  fetch(`/api/videoInfo?link=${this.state.LinkInput}`)
  .then(res => res.json())
  .then(json =>{
    if (json.success) {
      this.setState({
        videoInfo: json.info,
        videoInfoLoading: false
      });
    }else{
      this.setState({
        videoFailMessage: json.error,
        videoInfo: null,
        videoInfoLoading: false
      });
    }
  });
}

handleChange(event){
  this.setState({
    LinkInput: event.target.value,
  });

}


  render() {
    var {videoInfoLoading , videoInfo} = this.state;

    const hidden = {
      visibility: hidden
    }
    const visible = {
      visibility: visible
    }


    return(<div>
      <img className={(this.state.videoInfo||this.state.videoInfoLoading) ? "hide" :"videoNetstractMessage"} src={videoNetstractMessage} alt="videoNetstractMessage"/>
      <img className={(this.state.videoInfo||this.state.videoInfoLoading) ? "videoBox" :"hide"} src={thumbnail} alt="thumbnail"/>
      <img className="selectedButton" src={selectedButton} alt="selectedButton"/>

      <div className={(this.state.videoInfo||this.state.videoInfoLoading) ? "hide" :"videoInput"}>
      <InputGroup>
      <InputGroup.Prepend>
      <InputGroup.Text id="inputGroupPrepend"><i className="fas fa-link"></i></InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control
      type="text"
      placeholder="Link"
      aria-describedby="inputGroupPrepend"
      value={this.state.LinkInput}
      onChange={this.handleChange}
      required
      />
      <InputGroup.Append>
        <Button className="NetstractButton1"  variant="outline-dark" onClick={this.handleGetInfo}>Netstract <i className="fas fa-magnet"></i></Button>
      </InputGroup.Append>
      </InputGroup>
      </div>

      <div className={this.state.videoInfo ? "videoInput2" :"hide"}>
      <InputGroup>
      <InputGroup.Prepend>
      <InputGroup.Text id="inputGroupPrepend"><i className="fas fa-link"></i></InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control
      type="text"
      placeholder="Link"
      aria-describedby="inputGroupPrepend"
      value={this.state.LinkInput}
      onChange={this.handleChange}
      required
      />
      <InputGroup.Append>
        <Button className="NetstractButton1"  variant="outline-dark" onClick={this.handleGetInfo}>Netstract <i className="fas fa-magnet"></i></Button>
      </InputGroup.Append>
      </InputGroup>
      </div>

      {videoInfoLoading ? <h1 className="loading">Loading...</h1> :  null}
      {videoInfo ? <VideoOptions data={videoInfo}/> :  null}


      </div>)
  }

}

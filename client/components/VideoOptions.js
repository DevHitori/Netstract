import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Form, InputGroup, Col,Dropdown,DropdownButton } from 'react-bootstrap';
class Menu extends React.Component {
constructor(props){
  super(props);

  this.state ={
    title: this.props.data.title,
    selectedFormat: null,
    extentions: [...new Set(this.props.data.formats.map(f => f.ext))],
    selectedExtention: 'mp4',
    resolutions: [...new Set(this.props.data.formats.filter( f => f.width).map(f => f.width + 'x' + f.height))],
    selectedResolution: '',
    videoLink: this.props.data.webpage_url,
    netstractedVideo: '',
    videoFailMessage: ''
  }


  this.handleExLoad = this.handleExLoad.bind(this);
  this.handleChange = this.handleChange.bind(this);

 }

 componentDidMount(){
   console.log("title -", this.props.data.title);
   var formats = this.props.data.formats
   console.log("amt of formats - ",formats.length);
   var extentions = [...new Set(formats.map(f => f.ext))]
   console.log("extentions - ",extentions);
   var sizes = [...new Set(formats.filter( f => f.width).map(f => f.width + 'x' + f.height))]
   console.log('sizes -', sizes);
   console.log('image -', this.props.data.thumbnail);
   console.log('data -', this.props.data);
   this.setState({
     selectedResolution: this.state.resolutions[this.state.resolutions.length - 1],
     selectedFormat: this.props.data.formats.filter( f =>f.width).filter(f => f.ext == this.state.selectedExtention).filter(f => this.state.resolutions[this.state.resolutions.length - 1] == (f.width + 'x' + f.height) ).map(f => f.format_id)
   })
 }




 handleExLoad(e){
   const {videoLink,title, selectedFormat,selectedExtention} = this.state
   e.preventDefault();
   fetch(`/api/video?link=${videoLink}&name=${title}&format_id=${selectedFormat[selectedFormat.length -1]}&ext=${selectedExtention}`)
   .then(res => res.json())
   .then(json =>{
     if (json.success) {
       console.log(json.netstractedVideo);
       this.setState({
         netstractedVideo: json.netstractedVideo
       });
       window.location.replace(`/netstractedvideo?file=${json.netstractedVideo}`);
     }else{
       this.setState({
         videoFailMessage: json.reason
       });
     }
   });
 }

 handleChange(event){
  if (event.target.id == 'videoName') {
    this.setState({title: event.target.value});
  }else if(event.target.id == 'extention'){
    console.log('ext - ',event.target.value);
    this.setState({
      selectedExtention: event.target.value,
      resolutions: [...new Set(this.props.data.formats.filter( f =>f.width).filter(f => f.ext == event.target.value).map(f => f.width + 'x' + f.height))],
      selectedResolution: this.state.resolutions[this.state.resolutions.length - 1],
      selectedFormat: this.props.data.formats.filter( f =>f.width).filter(f => f.ext == this.state.selectedExtention).filter(f => this.state.resolutions[this.state.resolutions.length - 1] == (f.width + 'x' + f.height) ).map(f => f.format_id)
    });
  }else if(event.target.id == 'resolution'){
    console.log('res - ',event.target.value);
    console.log('TYPES1- - ',this.props.data.formats.filter( f =>f.width).filter(f => f.ext == this.state.selectedExtention).filter(f => event.target.value == (f.width + 'x' + f.height) ).map(f => f.format_id));

    this.setState({
      selectedResolution: event.target.value,
      selectedFormat: this.props.data.formats.filter( f =>f.width).filter(f => f.ext == this.state.selectedExtention).filter(f => event.target.value == (f.width + 'x' + f.height) ).map(f => f.format_id)
    });
  }
 }


 render(){
   return(<div>
   <img className="videoImg"
      src={this.props.data.thumbnail}
      alt="VideoThumbnail"
      />

<div className="videoData">
   <Form onSubmit={this.handleExLoad}>

 <InputGroup className="mb-3">
     <DropdownButton
       as={InputGroup.Prepend}
       variant="light"
       title={this.state.selectedResolution}
       id="resolution"
     >
     {this.state.resolutions ? this.state.resolutions.map( res => <Dropdown.Item onClick={()=> this.setState({selectedResolution: res})} >{res}</Dropdown.Item>) :<Dropdown.Item >Audio Only</Dropdown.Item> }

     </DropdownButton>
     <Form.Control
     type="text"
     placeholder="Name Video"
     aria-describedby="inputGroupPrepend"
     id="videoName"
     value={this.state.title}
     onChange={this.handleChange}
     required
     />
     <DropdownButton
       as={InputGroup.Append}
       variant="light"
       title={this.state.selectedExtention}
       id="extention"
     >
     {this.state.extentions.map( e => <Dropdown.Item onClick={()=> this.setState({selectedExtention: e})}>{e}</Dropdown.Item>)}
     </DropdownButton>
   </InputGroup>


   <Button className="NetstractButton2" variant="primary" type="submit">
   Netstract Video
   </Button>
   </Form>
   </div>
   </div>)
 }
}
export default Menu;

import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Form , Spinner } from 'react-bootstrap';
import { removeFromStorage, getFromStorage, setInStorage} from '../utils/storage';
import logo from '../images/Logo.png'
import menuPath from '../images/menuPath.png'
import menuBar from '../images/menuBar.png'
import api from '../images/api.png'
import aboutUs from '../images/aboutUs.png'
import contactUs from '../images/contactUs.png'
import extractData from '../images/extractData.png'
import extractVideo from '../images/extractVideo.png'
import extractWebpage from '../images/extractWebpage.png'
import extractImage from '../images/extractImage.png'
import signinButton from '../images/signinButton.png'
import signupButton from '../images/signupButton.png'

class Menu extends React.Component {
constructor(props){
  super(props);

  this.logout = this.logout.bind(this);

 }



 logout(){
     removeFromStorage('netstract');
     window.location.replace(`/`);
     fetch('/api/user?token=' + token,{method: 'DELETE'})
       .then(res => res.json())
       .then(json => {
         if (json.success) {
           window.location.replace(`/`);
         }else{
           console.log('Server Error')
         }
       });
   }

 render(){
   return(<div>
     <div className={( this.props.user ? "hide" : "SignButtons")}>
         <Link to="/signup"><img className="SignupButton" src={signupButton} alt="signupButton"/></Link>
         <Link to="/login"><img className="SigninButton" src={signinButton} alt="signinButton"/></Link>
     </div>
     <div className={( this.props.user ? "SignButtons" : "hide")}>
         <div className="SigninButton user">{this.props.user.email}</div>
        <Button className="SignupButton" variant="outline-secondary" onClick={this.logout}>Logout</Button>
     </div>
     <div className="menuDiv">
    <img className="menuPath" src={menuPath} alt="menuPath"/>
    <div className="menuContent">
    <img  className="menuBar" src={menuBar} alt="menuBar"/>
    <Link to="/"><img className="menuLogo" src={logo} alt="Netstract Logo"/></Link>
    <p className="menuLogoText">Extract anything from anywhere on the Net.</p>
    <div className="menuList">
    <h1 className="menuOPT disabled"><img className="aboutUs" src={aboutUs} alt="aboutUs"/></h1>
    <h1 className="menuOPT disabled"><img className="api" src={api} alt="api"/></h1>
    <h1 className="menuOPT disabled"><img className="contactUs" src={contactUs} alt="contactUs"/></h1>
    <h1 className="menuOPT disabled"><img className="extractImage" src={extractImage} alt="extractImage"/></h1>
    <Link to="/video"><h1 className="menuOPT "><img className="extractVideo" src={extractVideo} alt="extractVideo"/></h1></Link>
    <h1 className="menuOPT disabled"><img className="extractData" src={extractData} alt="extractData"/></h1>
    <h1 className="menuOPT disabled"><img className="extractWebpage" src={extractWebpage} alt="extractWebpage"/></h1>
    </div>
    </div>
   </div>
   <div className="menuFooter">Star or Contribute on <Link to="https://GitHub.com">GitHub</Link></div>
   </div>)
 }
}
export default Menu;

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {showSidebar} from '../actions/DefaultActions.jsx';
import {signoutUser} from '../actions/UserActions.jsx';

/*Components*/
import IconButton from 'material-ui/IconButton';
import LoginForm from './forms/LoginForm.jsx';
import UserProfile from './UserProfile';
import Headroom from 'react-headroom';


class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {displayLogin: false, displayUserInfo: false};
  }


  _onDialogDisable() {
    this.setState({displayLogin: false});
  }

  _onUserProfileDisable() {
    this.setState({displayUserInfo: false});
  }

  _onSignout() {
    this.props.signout();
  }

  _onShowUserProfile(e) {
    e.preventDefault();
    this.setState({displayUserInfo: true});
  }

  renderUserIcon() {
    if (this.props.authenticated) {
      return(
        <a href="#" onClick={this._onShowUserProfile.bind(this)}>
          <img src={this.props.avatar} className="comment-avatar" />
        </a>);
    }
    return <IconButton iconClassName="material-icons" tooltip="Login"
                       onClick={e=>this.setState({displayLogin:true})}>
      person
    </IconButton>

  }

  render() {
    return (
        <Headroom>
        <div className="appbar">
          <div className='row middle-xs'>
            <div className="col-xs-6">

                <a href="#" style={{fontSize:'32px', fontWeight:'bolder'}}> <span style={{color:'grey'}}>paper</span>Feed</a>


            </div>
            <div className="col-xs-6">

              {this.renderUserIcon()}
              
            </div>

            {!this.props.authenticated &&
            <LoginForm cb={this._onDialogDisable.bind(this)} visible={this.state.displayLogin}></LoginForm>}
            <UserProfile cb={this._onUserProfileDisable.bind(this)}
                         visible={this.state.displayUserInfo}></UserProfile>
          </div>
        </div>
        </Headroom>

    );
  }

}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    avatar: state.auth.avatar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout: bindActionCreators(signoutUser, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

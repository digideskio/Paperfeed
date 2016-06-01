import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {signoutUser, uploadAvatar} from '../actions/UserActions.jsx';
/*Components*/
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Spinner from 'react-spinkit';

class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: true
    }
  }

  _onSignout() {
    this.props.signout(); // - signout
    this.props.cb(); // - exit modal
  }

  _onEditAvatar(e) {
    let file = e.target.files[0];
    // - Called when user presses edit avatar button
    this.props.getAvatar(file);
  }
  

  render() {

    return (
      this.props.visible &&
      <ModalContainer onClose={this.props.cb}>
        <ModalDialog onClose={this.props.cb} style={{minWidth:330}}>
          <div className="row center-xs">
            <div className="col-xs-12">
              <h1>{this.props.email}</h1>
            </div>
            <div className="col-xs-12">
              <div className="userprofile_avatar">

                {this.state.imageLoaded ? <img src={this.props.avatar} width="100" height="100" style={{borderRadius: '50%'}} /> : <Spinner spinnerName='three-bounce'/>}
                 <br/>
                 <br/>
                <input onChange={this._onEditAvatar.bind(this)} type="file" name="data"/>
                <span className="divider-long"/>
              </div>
            </div>
          </div>
          <div className="row left-xs">
            <div className="col-xs">
              <FlatButton secondary={true} onClick={this._onSignout.bind(this)} label="Signout" secondary={true}/>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>
    );
  }

}

function mapStateToProps(state) {
  return {
    email: state.auth.email,
    avatar: state.auth.avatar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signout: bindActionCreators(signoutUser, dispatch),
    getAvatar: bindActionCreators(uploadAvatar, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

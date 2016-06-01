import React, {Component} from 'react';
//import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {signupUser} from '../../actions/UserActions.jsx';

import {reduxForm} from 'redux-form';
/*Components*/
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class Register extends Component {

  constructor(props) {
    super(props);
  }

  _onSubmit({email, password, cpassword}) {
    this.props.register(email, password, cpassword);
  }

  render() {
    const {handleSubmit, fields : {email, password, cpassword}} = this.props;

    return (
      this.props.visible &&
      <ModalContainer onClose={this.props.cb}>
        <ModalDialog onClose={this.props.cb} style={{minWidth:330}}>

          <h2>Register</h2>
          <span className='divider'/>
          <br/>
          <form onSubmit={handleSubmit(this._onSubmit.bind(this))}>

            <TextField hintText="Email" type="text" {...email}/>
            {email.touched && email.error && <div className="message message-error">{email.error}</div>}
            <br/>
            <TextField hintText="Password" type="password" {...password}/>
            {password.touched && password.error && <div className="message message-error">{password.error}</div>}
            <br/>
            <TextField hintText="Confirm Password" type="password" {...cpassword}/>
            {cpassword.touched && cpassword.error && <div className="message message-error">{cpassword.error}</div>}
            <br/>
            <FlatButton label="Signup" type="submit" secondary={true}/>

          </form>
        </ModalDialog>
      </ModalContainer>
    );
  }

}

function validate(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Email Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid Email Address'
  }
  if (!values.cpassword) {
    errors.cpassword = 'Please Enter A Password Confirmation';
  }

  if (values.password !== values.cpassword) {
    errors.password = 'Passwords Must Match';
  }
  return errors
}


function mapDispatchToProps(dispatch) {
  return {
    register: bindActionCreators(signupUser, dispatch)
  }
}

export default reduxForm({

  form: 'register',
  fields: ['email', 'password', 'cpassword'],
  validate

}, null, mapDispatchToProps)(Register);

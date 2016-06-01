import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {signinUser} from '../../actions/UserActions.jsx';
import {reduxForm} from 'redux-form';
/*Components*/
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import RegisterForm from './RegisterForm.jsx';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';


class Login extends Component {

  constructor(props) {
    super(props);
    this._onRegisterClose = this._onRegisterClose.bind(this);
    this._showRegister = this._showRegister.bind(this);
    this._onLoginClose = this._onLoginClose.bind(this);
    this.state = {showRegister: false, rememberMe: false};
  }

  _onSubmit({email, password}) {
    event.preventDefault();
    this.props.login(email, password, this.state.rememberMe);

  }

  _onRegisterClose() {
    this.setState({showRegister: false});
    this.props.resetForm();
  }

  _onLoginClose() {
    this.props.resetForm();
    this.props.cb();
  }

  _showRegister(event) {
    event.preventDefault();
    this.setState({showRegister: true});
  }

  _toggleCheckbox() {
    this.setState({rememberMe: !this.state.rememberMe})
  }

  render() {
    const {handleSubmit, fields : {email, password}} = this.props;

    return (
      this.props.visible &&
      <ModalContainer onClose={this._onLoginClose}>
        <ModalDialog style={{minWidth:330}}>

          <h2>Login</h2>
          <span className="divider white"/>
          <br/>
          <form onSubmit={handleSubmit(this._onSubmit.bind(this))}>

            <TextField hintText="Email" type="text" {...email}/>
            {email.touched && email.error && <div className="message message-error">{email.error}</div>}
            <br/>
            <TextField hintText="Password" type="password"  {...password}/>
            {password.touched && password.error && <div className="message message-error">{password.error}</div>}
            <br/>
            <br/>
            <Checkbox label="Remember me." checked={this.state.rememberMe} onCheck={this._toggleCheckbox.bind(this)}/>
            <br/>
            <FlatButton label="Login" type="submit" disabled={email.error && true}/>
            <FlatButton label="Signup" onClick={this._showRegister} secondary={true}/>

            <RegisterForm visible={this.state.showRegister} cb={this._onRegisterClose}></RegisterForm>

          </form>
        </ModalDialog>
      </ModalContainer>
    );
  }

}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.password) {
    errors.password = 'Please enter a password';
  }

  return errors
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(signinUser, dispatch)

  }
}

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    message: state.auth.message
  }
}

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
  validate

}, mapStateToProps, mapDispatchToProps)(Login);

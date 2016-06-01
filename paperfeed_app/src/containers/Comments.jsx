import React, {Component, propTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import axios from 'axios';

/*Components*/
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {notifActions} from 'redux-notif';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Timestamp from 'react-timestamp';
import Report from './Report';
import FlatButton from 'material-ui/FlatButton';

class Comments extends Component {

		static propTypes = {
				title: React.PropTypes.string,
				aid: React.PropTypes.string.isRequired
		}

		constructor(props) {
				super(props);
				this._onClose = this._onClose.bind(this);
				this._handleInput = this._handleInput.bind(this);
				this._handleSubmit = this._handleSubmit.bind(this);
				this.state = {comments: [], input: '', displayReport: false, victim:{}}
		}

		fetchComments() {
				const ROOT_URL = `/api/articles/comments?id=${this.props.aid}`
				axios.get(ROOT_URL)
						.then(response => {
								if (response.data.length > 0)
										this.setState({comments: response.data[0].AllComments.reverse()})
						})
		}

		componentWillMount() {
				// - When the component renders fetchCurrency data
				this.fetchComments();
		}

		_onClose() {
				this.props.cb();
		}

		_handleInput(e) {
				this.setState({input: e.target.value});
		}

		_handleSubmit(e) {
				e.preventDefault();
				if (!this.props.auth) {
						return this.props.notifs.notifSend({message: 'Please sign in.', kind: 'info', dismissAfter: 2000})
				}
				const config = {
						headers: {authorization: localStorage.getItem('token') || sessionStorage.getItem('token')}
				};

				const ROOT_URL = `/api/articles/comment?id=${this.props.aid}&comment=${this.state.input}`

				axios.post(ROOT_URL, {}, config)
						.then(response => {
								this.props.notifs.notifSend({message: response.data.Message, kind: 'info', dismissAfter: 2000});
								this.fetchComments();
						})

		}

		displayReport(comment) {
				this.setState({victim:comment, displayReport:true});
		}

		handleReportClose(){
				this.setState({displayReport:false})
		}

		_renderComments(comments) {

				if (comments.length > 0) {
						return (
								comments.map((comment, i) => {
										return (
												<div className="row" key={i}>
														<div className="col-xs-2 col-md-2">
																<img src={`/api/userapi/getavatar?email=${comment.Author}?${Date.now()}`}
																		 className="comment-avatar"/>

														</div>
														<div className="col-xs-10">
																<div className="comment-box">
																		<div className="comment-text">{comment.Text}</div>
																		<div className="comment-actions">
																				<div className="comment-actions__info">
																						<div className="comment-actions__username">{comment.Author}</div>
																						<div className="comment-actions__timestamp"><Timestamp
																								time={comment.Timestamp}/></div>
																				</div>
																				{comment.Author !=  this.props.email &&
																				<div className="comment-actions__report"><FlatButton label="Report" secondary={true} onClick={this.displayReport.bind(this, comment)}/></div>}

																		</div>
																</div>
														</div>
												</div>
										)
								})
						)
				}
				return <h3>No comment's for this post. Be first!</h3>
		}

		render() {
				const {comments} = this.state;

				return (
						<div>
								<span className="divider-long"></span>

								<div className="row left-xs middle-xs comment-form ">
										<div className="col-xs-2">
												<img src={this.props.avatar} className="comment-avatar"/>
										</div>
										<div className="col-xs-10">
												<div className="comment-box">

														<div className="row">
																<div className="col-xs-6">
																		<TextField multiLine={true} rowsMax={5} name="input" fullWidth={true}
																							 hintText="Be nice!" floatingLabelFixed={true}
																							 onChange={this._handleInput} value={this.state.input}/>
																</div>
																<div className="col-xs-3">
																		<IconButton onClick={this._handleSubmit} iconClassName="material-icons"
																								tooltip="Send">send
																		</IconButton>
																</div>
														</div>
												</div>
										</div>

								</div>
								<div className="comments-container">
										{this._renderComments(comments)}
								</div>
								<Report victim={this.state.victim} aid={this.props.aid} open={this.state.displayReport} handleReportClose={this.handleReportClose.bind(this)}/>
						</div>
				);
		}

}


function mapStateToProps(state) {
		return {
				auth: state.auth.authenticated,
				email: state.auth.email,
				avatar: state.auth.avatar
		}
}

function mapDispatchToProps(dispatch) {
		return {
				notifs: bindActionCreators(notifActions, dispatch)
		}
}

export default connect(
		mapStateToProps,
		mapDispatchToProps
)(Comments)

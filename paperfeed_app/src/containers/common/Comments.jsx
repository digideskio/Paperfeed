import React, {Component, propTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import axios from 'axios';

/*Components*/
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {notifActions} from 'redux-notif';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Timestamp from 'react-timestamp';

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
		this.state = {comments: [], input: ''}
	}

	fetchComments() {
		const ROOT_URL = `/api/articles/comments?id=${this.props.aid}`
		axios.get(ROOT_URL)
			.then(response => {
				if(response.data.length > 0)
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

		const ROOT_URL = `/api/articles/comment?id=${this.props.aid}&text=${this.state.input}`

		axios.post(ROOT_URL, {}, config)
			.then(response => {
				this.props.notifs.notifSend({message: 'Succesfully posted!', kind: 'info', dismissAfter: 2000});
				this.fetchComments();
			})

	}


	_renderComments(comments) {

		if (comments.length > 0) {
			return (
				comments.map(comment => {
					return (
						<div className="row" key={comment.timestamp}>
							<div className="col-xs-2 col-md-2">
								<img src={`/api/userapi/getavatar?email=${comment.Author}?${Date.now()}`} className="comment-avatar" />

							</div>
							<div className="col-xs-10">
								<div className="comment-box">
									<div className="comment-text">{comment.Text}</div>
									<div className="comment-actions">
										<div className="comment-actions__info">
											<div className="comment-actions__username">{comment.Author}</div>
											<div className="comment-actions__timestamp"><Timestamp time={comment.Timestamp}/></div>
										</div>
										<div className="comment-actions__report"><a href="#">Report</a></div>
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
				<div className="row left-xs middle-xs comment-form ">
					<div className="col-xs-2">
						<img src={this.props.avatar} className="comment-avatar" />
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

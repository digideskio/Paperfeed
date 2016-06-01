import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {setLocation} from '../actions/WidgetActions';
/*Components*/
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Location from 'react-geosuggest';

class GeoLocation extends Component {
	constructor() {
		super();
		this.state = {location: ''}
	}

	submit(){
		console.log(this.state.location);
		this.props.setLocation(this.state.location);
		this.props.cb();
	}


	onSuggestSelect(suggest){
		this.setState({location:suggest.label})
	}

	render(){
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.props.cb}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.submit.bind(this)}
			/>,
		];
		return (
			<Dialog
					title="Choose your location"
					actions={actions}
					modal={false}
					open={this.props.visible}
					onRequestClose={this.props.cb}
				>
			<div style={{minHeight:'10rem'}}>
				<Location
					placeholder="Where do you live?"
					initialValue={this.props.location}
					onSuggestSelect={this.onSuggestSelect.bind(this)}
					 />
			</div>
				</Dialog>
		);
	}
}

function mapStateToProps(state) {
	return {
		location : state.weather.location
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setLocation : bindActionCreators(setLocation, dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GeoLocation)

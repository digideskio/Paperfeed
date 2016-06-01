import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {fetchWeather} from '../../actions/WidgetActions';
/*External css*/
import 'weather-icons/weather-icons/weather-icons.min.less';
/*Components*/
import Spinner from 'react-spinkit';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import TextField from 'material-ui/TextField';
import GeoLocation from '../GeoLocation';

class Widget extends Component {

	constructor(props) {
		super(props);
		this.state = {next: true, intervalId: '', showSettings:false}
	}

	componentWillMount(){
		this.props.fetchWeather(this.props.location);
		let self = this;
		let intervalId = setInterval(function () {
			intervalId && self.setState({next: !self.state.next});
		}, 15000);
		this.setState({intervalId});
	}

	componentWillUnmount(){
		clearInterval(this.state.intervalId);
	}

	// - Decides what icon to render according to type of weather
	_renderWeatherIcon(type) {
		if (type == "Clear") {
			return <i className="wi wi-day-sunny"/>
		} else if (type == "Rain") {
			return <i className="wi wi-rain"/>
		} else if (type == "Snow") {
			return <i className="wi wi-snow"/>
		} else if (type == "Clouds") {
			return <i className="wi wi-cloudy"/>
		}

		return <i className="wi wi-day-sunny"/>;

	}

	showSettings(){
		this.setState({showSettings:true});
	}

	hideSettings(){
		this.setState({showSettings:false});
	}

	// - returns list of weather according to the state "next"
	_renderWeather(data) {
		return (<div className="row">
			<a href="#" style={{color:'grey'}} className="col-xs-3 widget-element" onClick={this.showSettings.bind(this)}>
					{data.city.name}
			</a>
			{data.list.map((i, p) => {
				if (p > 2 && this.state.next) return null;
				if (p <= 2 && !this.state.next) return null;
				return (
					<div key={i.dt} className="col-xs-3 widget-element">
						{this._renderWeatherIcon(i.weather[0].main)}
						<span style={{marginLeft:3}}>{Math.round(i.main.temp)} °C</span>
						<span
							style={{marginLeft:3, fontSize:12, color:'rgb(150, 150, 150)'}}>{i.dt_txt.substring(10).slice(0, -3)}</span>
					</div>
				)
			})}
		</div>)
	}


	render() {
		const {isPending, data} = this.props.weather;
		return (

			<div className='widget'>
				<GeoLocation visible={this.state.showSettings} cb={this.hideSettings.bind(this)}></GeoLocation>
				{
					isPending ?
						<div className="row center-sm middle-sm">
							<div className="col-xs-12">
								<Spinner spinnerName='three-bounce'/>
							</div>
						</div>
						:
						this._renderWeather(data)
				}
			</div>
		);
	}

}


function mapStateToProps(state) {
	return {
		weather: state.weather,
		location: state.weather.location
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchWeather: bindActionCreators(fetchWeather, dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Widget)

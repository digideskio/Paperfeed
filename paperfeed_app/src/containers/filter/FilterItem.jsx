import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {addFilter} from '../../actions/DefaultActions';


class FilterItem extends Component {

		constructor() {
				super();
				this.state = {checked: false}
		}

		decideClassName() {
				if (this.props.deactive)
						return 'col-xs filter-item filter-item__deactive'
				return 'col-xs filter-item'
		}

		addFilter() {
				this.props.addFilter(this.props.name);
		}

		render() {
				return <div className={this.decideClassName()} onClick={this.addFilter.bind(this)}>
						<span>{this.props.name}</span>
				</div>
		}
}


function mapStateToProps(state) {
		return {
				sources: state.filters.selectedSources
		}
}

function mapDispatchToProps(dispatch) {
		return {
				addFilter: bindActionCreators(addFilter, dispatch)
		}
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterItem);

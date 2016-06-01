import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {getSources, addFilter, clearFilter} from '../../actions/DefaultActions';

/*Components*/
import FilterItem from './FilterItem';

class FilterList extends Component {

		constructor() {
				super();
				this.state = {currentPath: '/'};

		}

		_handleClick(selectedSource) {
				this.props.addFilter(selectedSource);
		}

		componentWillMount() {
			 this.props.getSources();
		}


		// Filter function returns only if not falsified
		isInListFilter(filter) {
				// - Filters
				if(filter.Category == this.props.category)
						return filter;
		}

		// - Returns true/false if filter exists in selectedSources
		inList (filter){
				return this.props.filters.selectedSources.map(e => e).indexOf(filter.Source) > 0;
		}

		_renderFilters(filters) {
				return filters.filter(this.isInListFilter.bind(this)).map(filter => {
						if(this.inList(filter)){
							 return <FilterItem key={filter.Source} deactive={true} name={filter.Source}></FilterItem>
						}
						return <FilterItem key={filter.Source} deactive={false} name={filter.Source}></FilterItem>
				});
		}

		render() {

				return (
						<div className="row filter-list">
								{this._renderFilters(this.props.filters.fetchedSources)}
						</div>
				);
		}
}

function mapStateToProps(state) {
		return {
				filters: state.filters
		}
}

function mapDispatchToProps(dispatch) {
		return {
				getSources: bindActionCreators(getSources, dispatch),
				addFilter: bindActionCreators(addFilter, dispatch),
				clearFilter: bindActionCreators(clearFilter, dispatch)


		}
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterList);

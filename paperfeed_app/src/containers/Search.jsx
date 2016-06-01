import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {search} from '../actions/DefaultActions.jsx';

/*Components*/
import TextField from 'material-ui/TextField';
import SearchContainer from './SearchContainer';

class Search extends Component {

    constructor() {
        super();
        this._handleSearch = this._handleSearch.bind(this);
    }


    _handleSearch(event) {
        this.props.search(event.target.value);
    }

    render() {
        return (
            <div className="searchBar">
                <div className="row">
                    <div className="col-xs-12">
                        <TextField onChange={this._handleSearch} hintText="Live Search" value={this.props.term}
                                   fullWidth={true}
                                   id="search-input"/>
                    </div>
                    <div className="col-xs-12">
                        <SearchContainer></SearchContainer>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        term: state.filters.search
    }
}

function mapDispatchToProps(dispatch) {
    return {
        search: bindActionCreators(search, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)

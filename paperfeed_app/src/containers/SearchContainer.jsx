import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {fetchArticles} from '../actions/ArticleActions';

/*Component*/
import FilterContainer from './filter/FilterContainer';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// - Use to store components like filter, sort and etc inside search-box
class SearchContainer extends Component {

    constructor() {
        super();
        this.state = {filterVisible: false, currentPath: '/'};
    }

    _handleFilterClick() {
        this.setState({filterVisible: !this.state.filterVisible});
    }

    handleOpen = () => {
        this.setState({filterVisible: true});
    };

    handleClose = () => {
        this.setState({filterVisible: false});
        let query = this.props.filters.map(filter => `&filters=${filter}`).join('');
        this.props.refreshArticles(this.props.path, '', query);
    };

    render() {
        const actions = [
            <FlatButton
                label="Exit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />
        ];

        const modal = {
            width: '95%'
        };

        return (


            <div className="searchContainer">
                <div className="row end-xs middle-sm">
                    <div className="col-xs-3">
                        <FlatButton onClick={e => this.setState({filterVisible:true})} label="Filters"
                                    secondary={true}></FlatButton>
                        <Dialog
                            bodyStyle={{padding:'3px'}}
                            contentStyle={modal}
                            title="Choose what you want to see"
                            actions={actions}
                            modal={false}
                            open={this.state.filterVisible}
                            onRequestClose={this.handleClose.bind(this)}>

                            <FilterContainer ></FilterContainer>
                        </Dialog>
                    </div>

                </div>
            </div>

        );
    }

}

function mapStateToProps(state){
    return {
        filters : state.filters.selectedSources,
        path: state.settings.path
    }
}
function mapDispatchToProps(dispatch) {
    return {
        refreshArticles: bindActionCreators(fetchArticles, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
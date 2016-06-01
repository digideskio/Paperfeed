import React, {Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {hashHistory} from 'react-router';
import {changeCurrentPath} from '../actions/DefaultActions';

/*Components*/
import {Tabs, Tab} from 'material-ui/Tabs';

class TabsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {activeTab: '/'};
    }


    componentWillMount() {
        // - Listen for path changes

        hashHistory.listen(ev => {
            this.setState({activeTab: ev.pathname});
            this.props.changePath(ev.pathname);
        });

    }

    handleChange(value) {

        this.setState({activeTab: value}, function () {
            hashHistory.push(value);

        });

    }

    render() {

        return (
            <Tabs className="tabs" value={this.state.activeTab}
                  onChange={this.handleChange.bind(this)}>
                <Tab label="Front" value="/"></Tab>
                <Tab label="Sport" value="/sport"></Tab>
                <Tab label="Economy" value="/economy"></Tab>
                <Tab label="Tech" value="/tech"></Tab>
                <Tab label="Gaming" value="/gaming"></Tab>

            </Tabs>



        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        changePath: bindActionCreators(changeCurrentPath, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(TabsComponent)

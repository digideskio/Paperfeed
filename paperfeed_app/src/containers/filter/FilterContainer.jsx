import React, {Component} from 'react';

/*Components*/
import {Tabs, Tab} from 'material-ui/Tabs';
import FilterList from './FilterList';

// - Container for everything to do with filtering
class FilterContainer extends Component {


    constructor() {
        super();
        this.state = {
            value: 'Front'
        };
    }

    handleChange(value){
        this.setState({
            value
        });
    }

    render() {
        return (
            <div>

                <Tabs value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <Tab label="Front" value="Front"></Tab>
                    <Tab label="Sport" value="Sport"></Tab>
                    <Tab label="Tech" value="Tech"></Tab>
                    <Tab label="Economy" value="Economy"></Tab>
                    <Tab label="Gaming" value="Gaming"></Tab>
                </Tabs>

                <FilterList category={this.state.value}></FilterList>

            </div>
        );
    }

}

export default FilterContainer;
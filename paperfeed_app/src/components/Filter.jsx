import React, {Component} from 'react';
import FilterList from '../containers/filter/FilterList';

class Filter extends Component {


    constructor() {
        super();
        this.state = {visible : false};
    }

    render() {
        return (
            <FilterList/>
        );
    }


}

export default Filter;
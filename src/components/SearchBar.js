import React, { Component } from "react";
import { TextField } from "@material-ui/core";

class SearchBar extends Component {

    handleSearch = (value) => {
        return this.props.onSearch(value)
    }


    render() {
        const { title, onSearch } = this.props;
        return <TextField
            id="searchBar"
            label={title ? title : ''}
            variant="outlined"
            className=""
            onChange={(e) => this.handleSearch(e.target.value)}
        />;
    }
}

export default SearchBar;

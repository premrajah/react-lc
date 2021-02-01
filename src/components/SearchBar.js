import React, { Component } from "react";
import { InputAdornment, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";

class SearchBar extends Component {
    handleSearch = (value) => {
        return this.props.onSearch(value);
    };

    render() {
        const { title, onSearch } = this.props;
        return (
            <TextField
                id="searchBar"
                label={title ? title : ""}
                variant="outlined"
                className=""
                onChange={(e) => this.handleSearch(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />
        );
    }
}

export default SearchBar;

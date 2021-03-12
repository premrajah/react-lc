import React, {Component} from "react";
import {InputAdornment, TextField} from "@material-ui/core";
import SearchGray from "@material-ui/icons/Search";

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
                            <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                        </InputAdornment>
                    )
                }}
            />
        );
    }
}

export default SearchBar;

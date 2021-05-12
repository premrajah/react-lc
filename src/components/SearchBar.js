import React, { Component } from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import SearchGray from "@material-ui/icons/Search";

class SearchBar extends Component {

    state = {
        filterDefaultValue: ''
    }

    handleSearch = (value) => {
        return this.props.onSearch(value);
    };

    handleSearchFilter = (value) => {
        this.setState({filterDefaultValue: value});
        return this.props.onSearchFilter(value);
    }

    render() {
        const { title, searchType, onSearch, onSearchFilter, dropDown, dropDownValues } = this.props;
        return (
            <div className="row">
                <div className="col d-flex">
                    <div style={{width: dropDown ? '70%' : '100%'}}>
                        <TextField
                            id="searchBar"
                            label={title ? title : ""}
                            variant="outlined"
                            className=""
                            value={this.state.searchValue}
                            placeholder={searchType ? searchType : "Search"}
                            onChange={(e) => this.handleSearch(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    {dropDown && <div style={{width: dropDown ? '30%' : ''}}>
                        <FormControl variant="outlined"  component="div">
                            <InputLabel id="filterLabel">Filter</InputLabel>
                            <Select labelId="filterLabel" label="Select Filter" value={this.state.filterDefaultValue} onChange={(e) => this.handleSearchFilter(e.target.value)} >
                                {dropDownValues.length > 0 ? dropDownValues.map((drop, index) => {
                                    return <MenuItem key={index} value={drop}>{drop}</MenuItem>
                                }) : null}
                            </Select>
                        </FormControl>
                    </div>}
                </div>
            </div>
        );
    }
}

export default SearchBar;

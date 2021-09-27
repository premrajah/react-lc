import React, { Component } from "react";
import {FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import SearchGray from "@material-ui/icons/Search";
import NativeSelect from '@material-ui/core/NativeSelect';
import NativeSelectInput from "@material-ui/core/NativeSelect/NativeSelectInput";
class SearchBar extends Component {

    state = {
        filterDefaultValue: ''
    }

    handleSearch = (value) => {
        return this.props.onSearch(value);
    };

    handleSearchFilter = (value) => {
        this.setState({filterDefaultValue: value});
        return this.props.onSearch(value);
    }

    render() {
        const { title, searchType, onSearch, dropDown, dropDownValues } = this.props;
        return (
            <div className="row">
                <div className="col d-flex">

                    <div style={{width:  '100%'}} className={"search-container"}>
                        <FormControl className={"filter-box"} style={{width:  '10.5%'}}  component="div">


                            <NativeSelect label="Filter" className="search-filter"    value={this.state.filterDefaultValue} onChange={(e) => this.handleSearchFilter(e.target.value)} >
                                <option value="" >
                                    Filter By
                                </option>
                                {dropDownValues&&dropDownValues.length > 0 ? dropDownValues.map((drop, index) => {
                                    return <option  key={index} value={drop}>{drop}</option>
                                }) : null}
                            </NativeSelect>
                        </FormControl>

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
                </div>
            </div>
        );
    }
}

export default SearchBar;

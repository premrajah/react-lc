import React, {Component} from "react";
import {InputAdornment} from "@mui/material";
// import SearchGray from "@mui/icons-material/Search";
import SearchGray from '@mui/icons-material/Search';



class SearchBox extends Component {

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
        const { title, searchType, onSearch, dropDown, dropDownValues } = this.props;
        return (
            <div className="row ">
                <div className="col d-flex position-relative">

                    <div className="search-box">

                            {dropDownValues&&dropDownValues.length > 0 &&
                                <select className="search-select text-capitlize rad-4"
                                        // style={{width:  'auto'}}
                                        label="Filter"  value={this.state.filterDefaultValue} onChange={(e) => this.handleSearchFilter(e.target.value)} >
                                    <option value="" >
                                        Filter By
                                    </option>
                                    {dropDownValues&&dropDownValues.length > 0 ? dropDownValues.map((drop, index) => {
                                        return <option   key={index} value={drop.key}>{drop.label}</option>
                                    }) : null}
                                </select>}
                        <input
                            type="text"
                            className="search-input rad-8"
                                // id="searchBar"
                                label={title ? title : ""}
                                variant="outlined"
                               value={this.state.searchValue}
                                placeholder={searchType ? searchType : "Search"}
                                onChange={(e) => this.handleSearch(e.target.value)}

                        />
                            <a className="search-btn" href="#">

                                <i className="fas fa-search"></i>
                            </a>
                    </div>

                    {/*<div style={{width:  '100%'}} className={"" +*/}
                    {/*    "search-box " +*/}
                    {/*    "custom-select" +*/}
                    {/*    "  rad-8"}>*/}

                    {/*    {dropDownValues&&dropDownValues.length > 0 &&*/}
                    {/*        <select style={{width:  'auto'}} label="Filter" className=" text-capitlize rad-4"  value={this.state.filterDefaultValue} onChange={(e) => this.handleSearchFilter(e.target.value)} >*/}
                    {/*            <option value="" >*/}
                    {/*                Filter By*/}
                    {/*            </option>*/}
                    {/*            {dropDownValues&&dropDownValues.length > 0 ? dropDownValues.map((drop, index) => {*/}
                    {/*                return <option   key={index} value={drop.key}>{drop.label}</option>*/}
                    {/*            }) : null}*/}
                    {/*        </select>}*/}


                    {/*    <input*/}
                    {/*        type={"text"}*/}
                    {/*        id="searchBar"*/}
                    {/*        className={"rad-8"}*/}
                    {/*        label={title ? title : ""}*/}
                    {/*        variant="outlined"*/}
                    {/*        className=""*/}
                    {/*        value={this.state.searchValue}*/}
                    {/*        placeholder={searchType ? searchType : "Search"}*/}
                    {/*        onChange={(e) => this.handleSearch(e.target.value)}*/}
                    {/*        // InputProps={{*/}
                    {/*        //     endAdornment: (*/}
                    {/*        //         <InputAdornment position="end">*/}
                    {/*        //*/}
                    {/*        //         </InputAdornment>*/}
                    {/*        //     ),*/}
                    {/*        // }}*/}
                    {/*    />*/}
                    {/*    <SearchGray className={"search-icon"} style={{ fontSize: 24, color: "#B2B2B2" }} />*/}
                    {/*</div>*/}
                </div>

                <style jsx>{`
                /* div */


`}</style>
            </div>


        );
    }
}

export default SearchBox;

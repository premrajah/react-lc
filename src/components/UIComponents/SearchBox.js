import React, { Component } from "react";

// import SearchGray from "@mui/icons-material/Search";


class SearchBox extends Component {


    constructor(props) {
        super(props);
        this.loadingRef = React.createRef();
        this.state = {
            isIntersecting: false,
            intersectionRatio: 0,
            searchValue: "",
            filterValue: "",
            displayFields: false,
            filterChanged: false,
            searchQueryChanged: false,
            filterOldValue: {},

        };
    }

    handleSearch = (type, value) => {
        let filterVal = this.state.filterValue
        let searchVal = this.state.searchValue

        if (type === "keyword") {
            searchVal = value
            this.setState({
                searchValue: value
            })
            return this.props.onSearch(filterVal, searchVal);
        }
        if (type === "filter") {
            filterVal = value
            this.setState({
                filterValue: value
            })

            if (searchVal && searchVal !== undefined)
                return this.props.onSearch(filterVal, searchVal);
        }


    };

    handleSearchFilter = (value) => {


        this.setState({ filterValue: value });

        if (value)
            this.setState({
                filterChanged: true
            })
        else
            this.setState({
                filterChanged: false
            })


        return this.props.onSearchFilter(value);

    }

    showSearchFilter = (show) => {


        if (this.state.searchQueryChanged || this.state.filterChanged) {
            this.setState({
                displayFields: true
            })
        } else {
            this.setState({
                displayFields: show
            })
        }



    }

    componentDidMount() {
        // this.setState({
        //     searchValue: this.props.initialFilter.keyword,
        //     filterValue: this.props.initialFilter.filter,
        // })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps !== this.props) {


            if ((JSON.stringify(this.props.initialFilter) !== JSON.stringify(this.state.filterOldValue))) {
                this.setState({
                    filterOldValue: this.props.initialFilter
                })
                if (this.props.initialFilter.keyword) {
                    this.setState({
                        searchValue: this.props.initialFilter.keyword,
                    })
                } else {
                    this.setState({
                        searchValue: "",
                    })
                }
                if (this.props.initialFilter.filter) {
                    this.setState({
                        filterValue: this.props.initialFilter.filter,
                    })
                } else {
                    this.setState({
                        filterValue: "",
                    })
                }
            }



        }
    }

    render() {
        const { title, searchType, onSearch, dropDown, dropDownValues } = this.props;
        return (
            <div className="row  " style={{ right: 0, top: 0, bottom: 0 }}>
                <div className="col-12 d-flex justify-content-end align-items-center position-relative pe-0">

                    <div
                        // onMouseEnter={()=>this.showSearchFilter(true)}

                        // onMouseLeave={()=>this.showSearchFilter(false)}
                        className={`search-box-new w-100 ${this.state.displayFields || true ? "search-box-hover" : ""} `} >

                        {dropDownValues && dropDownValues.length > 0 &&
                            <select className="search-select text-capitlize "
                                // onBlur={()=>{ this.showSearchFilter(false)}}
                                // style={{width:  'auto'}}
                                label="Filter"
                                value={this.state.filterValue}
                                onChange={(e) => this.handleSearch("filter", e.target.value)} >
                                <option value="" >
                                    Filter By
                                </option>
                                {dropDownValues && dropDownValues.length > 0 ? dropDownValues.filter(item => !item.notFilterable).map((drop, index) => {
                                    return <option
                                        // selected={drop.field===this.state.filterValue}
                                        key={index} value={drop.field}>{drop.label}</option>
                                }) : null}
                            </select>}
                        <input
                            autoFocus
                            type="text"
                            className="search-input-new "
                            // id="searchBar"
                            label={title ? title : ""}
                            variant="outlined"
                            // onBlur={()=>{ this.showSearchFilter(false)}}
                            value={this.state.searchValue}
                            placeholder={searchType ? searchType : "Search"}
                            onChange={(e) => this.handleSearch("keyword", e.target.value)}

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

                <style jsx="true">{`

.search-box-new{
height: 40px;
position: relative;
padding: 2px;
display: flex;
    height: 44px;

}



.search-box-new .search-input-new {
    outline: none;
    border: none;
    background: none;
    width: 0;
    padding: 0;
    /*color: #fff;*/
    float: left;
    font-size: 16px;
    //transition: .3s;
  
height: 40px;
    
}
//.search-input-new::placeholder {
//    color: #dbc5b0;
//}
/* icon */
.search-btn {
    color: #fff;
    float: right;
    width: 40px;
    height: 40px;
    /*   border-radius: 50px; */
    background: #27245c;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    //transition: .3s;
}

.search-box-new .search-select{
  height: 32px;
   outline: none;
  text-align:center;
  width: 0;
    border: none;
    background: none;
    padding: 0;
     //animation: animateSelect 1s reverse ;
     background: #eaeaef!important;
  //margin: 4px;
  //color: white;
  border-radius: 4px;
}

.search-box-hover .search-select{
margin: 4px;
}

.search-box-new{
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: #eee 1px solid;
  padding: 0;
}


.search-box-hover .search-btn{
  color: var(--lc-purple)!important;
  background: white;
  
}


.search-box-new{
  background: white!important;
}


.search-box-hover> .search-select  {
    
    padding: 0 6px;
     transform-origin: 100% 50%;
    animation: animateSelect 0.25s forwards ;
 
}


.search-box-hover  .search-input-new {
 transform-origin: 100% 50%;
  animation: animateInput 0.25s forwards ;
 
}

@keyframes animateSelect {
   0%   {width:0; transform: scale(0);}
  100% {width: auto; transform: scale(1);}
}

@keyframes animateInput {
  0%   {width:0; transform: scale(0);}
  100% {width: 100%; transform: scale(1);}
}

`}</style>
            </div>


        );
    }
}

export default SearchBox;

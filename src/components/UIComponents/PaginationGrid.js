import React, {Component} from "react";
import CustomDataGridTable from "./CustomDataGridTable";
import {PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import MenuDropdown from "../FormsUI/MenuDropdown";
import SearchBox from "./SearchBox";
import {removeEmptyValuesObj} from "../../Util/GlobalFunctions";

class PaginationGrid extends Component {
    constructor(props) {
        super(props);
        this.loadingRef = React.createRef();
        this.state = {
            isIntersecting: false,
            intersectionRatio: 0,
            searchValue: "",
            filterValue: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {

            if (this.props.refresh){

            }

        }
    }


    searchValue= ""
    filterValue= ""
    componentDidMount() {

        // this.loadMore(true);
    }

    componentWillUnmount() {
        // this.observer.unobserve(this.loadingRef);
    }

    timeout = 0;

    loadMore = (reset,sort,newPage) => {

        // alert(sort.key+" "+sort.sort)

        let filterData={
            searchValue: this.searchValue,
            searchFilter: this.filterValue,
            reset: reset,
            sort:sort,
            newPage:newPage
        }

        // console.log(filterData)
        // removeEmptyValuesObj(filterData)

        // console.log(filterData)

        this.props.loadMore(filterData);
    };
    timeoutSearch() {
        if (this.timeout) {
            // console.debug("clear prev search ")
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.loadMore(true);
            // console.debug("search this ",this.searchValue)
        }, 1500);
    }

    handleSearch = (filterValue,searchValue) => {
        searchValue = searchValue.trim();

        this.searchValue = searchValue;
        // this.setState({ searchValue: searchValue });

        this.filterValue=filterValue
            this.timeoutSearch();

    };

    handleSearchFilter = (filterValue) => {
        this.filterValue = filterValue;

        if (this.searchValue) {
            this.loadMore(true);
        }
    };

    render() {
        const { children } = this.props;
        return (
            <>
                {!this.props.hideSearch && (
                    <div className="row  justify-content-center search-container d-flex align-items-center  pt-3 pb-3">
                        <div className="col-md-6 col-12 position-relative ">
                            {children}
                        </div>
                            <div className="col-md-6 col-12 position-relative ">
                            <SearchBox
                                initialFilter={this.props.initialFilter}
                                onSearch={this.handleSearch}

                                // onSearchFilter={(fv) => this.handleSearchFilter(fv)}
                                dropDown
                                dropDownValues={this.props.data.headers}
                            />
                            </div>

                    </div>
                )}
                <div className="row  ">
                    <div className="col-md-12 col-12 position-relative pe-0 ">
                <CustomDataGridTable
                    loadMore={(reset,sortData,newPage) => this.loadMore(reset,sortData,newPage)}
                    // headers={this.props.headers}
                    items={this.props.items}
                    pageSize={this.props.pageSize}
                    count={this.props.count}
                    resetSelection={this.props.resetSelection}
                    currentPage={this.props.currentPage}
                    loading={this.props.loading}
                    actions={this.props.actions}
                    checkboxSelection={this.props.checkboxSelection}
                    actionCallback={this.props.actionCallback}
                    sortData={(sortData)=>this.loadMore(true, sortData)}
                    setMultipleSelectFlag={this.props.setMultipleSelectFlag}
                    data={this.props.data}
                />
                    </div>
                </div>

            </>
        );
    }
}


export default PaginationGrid;

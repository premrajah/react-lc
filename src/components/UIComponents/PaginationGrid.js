import React, {Component} from "react";
import CustomDataGridTable from "./CustomDataGridTable";
import {PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import MenuDropdown from "../FormsUI/MenuDropdown";
import SearchBox from "./SearchBox";

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

        this.loadMore(true);
    }

    componentWillUnmount() {
        // this.observer.unobserve(this.loadingRef);
    }

    timeout = 0;

    loadMore = (reset,sort,newPage) => {

        // alert(sort.key+" "+sort.sort)
        this.props.loadMore({
            searchValue: this.searchValue,
            searchFilter: this.filterValue,
            reset: reset,
            sort:sort,
            newPage:newPage
        });
    };
    timeoutSearch() {
        if (this.timeout) {
            // console.debug("clear prev search ")
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.loadMore(true);
            // console.debug("search this ",this.searchValue)
        }, 3000);
    }

    handleSearch = (searchValue) => {
        searchValue = searchValue.trim();

        this.searchValue = searchValue;
        // this.setState({ searchValue: searchValue });

        this.searchValue=searchValue
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
                        <div className="col-md-12 col-12 position-relative ">
                            {children}


                            <SearchBox
                                onSearch={(sv) => this.handleSearch(sv)}
                                onSearchFilter={(fv) => this.handleSearchFilter(fv)}
                                dropDown
                                dropDownValues={this.props.dropDownValues}
                            />
                        </div>

                    </div>
                )}



                <CustomDataGridTable
                    loadMore={(reset,sortData,newPage) => this.loadMore(false,sortData,newPage)}
                    headers={PRODUCTS_FILTER_VALUES_KEY}
                    items={this.props.items}
                    pageSize={this.props.pageSize}
                    count={this.props.count}
                    loading={this.props.loading}
                    actions={this.props.actions}
                    checkboxSelection={this.props.checkboxSelection}
                    actionCallback={this.props.actionCallback}
                    // sortData={(sortData)=>this.loadMore(true, sortData)}

                />


            </>
        );
    }
}


export default PaginationGrid;

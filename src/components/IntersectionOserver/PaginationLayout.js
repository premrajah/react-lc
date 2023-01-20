import React, {Component} from "react";
import SearchBar from "../SearchBar";
import {LoaderAnimated} from "../../Util/GlobalFunctions";
import DynamicElement from "../UIComponents/DynamicElement";

class PaginationLayout extends Component {
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
        if (prevProps != this.props) {

            if (this.props.refresh){

            }

        }
    }


    searchValue= ""
    filterValue= ""
    componentDidMount() {
        this.loadNewPageSetUp();
    }

    componentWillUnmount() {
        // this.observer.unobserve(this.loadingRef);
    }

    // Options
    options = {
        root: null, // Page as root
        rootMargin: "0px",
        threshold: 1.0,
    };
    observer;
    loadNewPageSetUp = () => {
        // Create an observer
        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this), //callback
            this.options
        );

        if (this.loadingRef) this.observer.observe(this.loadingRef);
    };

    handleObserver = (entities, observer) => {
        let [entry] = entities;

        if (entry.intersectionRatio > this.state.intersectionRatio) {
            this.loadMore(false);
        }

        this.setState({
            intersectionRatio: entry.intersectionRatio,
        });
    };

    timeout = 0;

    loadMore = (reset) => {
        this.props.loadMore({
            searchValue: this.searchValue,
            searchFilter: this.filterValue,
            reset: reset,
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
            // alert("filter changed")
            this.loadMore(true);
        }
    };

    render() {
        const { children } = this.props;
        return (
            <>
                {!this.props.hideSearch && (
                    <div className="row  justify-content-center search-container  pt-3 pb-3">
                        <div className={"col-12"}>
                            <SearchBar
                                onSearch={(sv) => this.handleSearch(sv)}
                                onSearchFilter={(fv) => this.handleSearchFilter(fv)}
                                dropDown
                                dropDownValues={this.props.dropDownValues}
                            />
                        </div>
                    </div>
                )}

                {!this.props.hideCount && (
                    <div className="row  justify-content-center filter-row  pb-3">
                        <div className="col">
                            <p className="text-gray-light ms-2 ">
                                Showing {this.props.visibleCount} of {this.props.count}
                            </p>
                        </div>
                    </div>
                )}

                {children}

                <div
                    className={
                        !this.props.lastPageReached && !this.props.loadingResults
                            ? "row  justify-content-center filter-row  pt-3 pb-3"
                            : "d-none"
                    }>
                    <div ref={(loadingRef) => (this.loadingRef = loadingRef)} className="col"></div>
                </div>

                <DynamicElement
                    element={this.props.element}
                    className={
                        this.props.loadingResults
                            ?this.props.element=="tr"?"" : "row  justify-content-center filter-row  pt-3 pb-3"
                            : "d-none"}
                    >
                    <DynamicElement
                        element={this.props.element=="tr"?"td":""}
                        colspan={this.props.colspan}
                        className={
                            this.props.element=="tr"?"" :"col-12 justify-content-center text-center"}
                        >
                        <LoaderAnimated />
                    </DynamicElement>
                </DynamicElement>

                <div
                    className={
                        !this.props.loadingResults && this.props.count === 0
                            ? "row  justify-content-center filter-row  pt-3 pb-3"
                            : "d-none"
                    }>
                    <div className="col jus text-center">
                        <div className="text-gray-light"> No results found!</div>
                    </div>
                </div>
            </>
        );
    }
}


export default PaginationLayout;

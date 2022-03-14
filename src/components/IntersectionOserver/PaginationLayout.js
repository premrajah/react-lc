import React, {Component} from "react";
import SearchBar from "../SearchBar";

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
            searchValue: this.state.searchValue,
            searchFilter: this.state.filterValue,
            reset: reset,
        });
    };
    timeoutSearch() {
        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.loadMore(true);
        }, 1500);
    }

    handleSearch = (searchValue) => {
        searchValue = searchValue.trim();

        this.searchValue = searchValue;
        this.setState({ searchValue: searchValue });

        if (this.state.searchValue) {
            this.timeoutSearch();
        }
    };

    handleSearchFilter = (filterValue) => {
        this.filterValue = filterValue;

        this.setState({ filterValue: filterValue });

        if (this.state.searchValue) {
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
                            <p className="text-gray-light ml-2 ">
                                Showing {this.props.visibleCount} of {this.props.count} Products
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

                <div
                    className={
                        this.props.loadingResults
                            ? "row  justify-content-center filter-row  pt-3 pb-3"
                            : "d-none"
                    }>
                    <div className="col">
                        <LoaderAnimated />
                    </div>
                </div>

                <div
                    className={
                        !this.props.loadingResults && this.props.count === 0
                            ? "row  justify-content-center filter-row  pt-3 pb-3"
                            : "d-none"
                    }>
                    <div className="col text-center">
                        <div className="text-gray-light"> No results found!</div>
                    </div>
                </div>
            </>
        );
    }
}

function LoaderAnimated() {
    return (
        <div className="wrapper-loader text-center">
            <svg
                className="hourglass"
                xmlns="http://www.w3.org/2000/svg mr-4"
                viewBox="0 0 120 206"
                preserveAspectRatio="none">
                <path
                    className="middle"
                    d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"
                />
                <path
                    className="outer"
                    d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"
                />
            </svg>

            <span className={"ml-4"}>Loading ...</span>
        </div>
    );
}

export default PaginationLayout;

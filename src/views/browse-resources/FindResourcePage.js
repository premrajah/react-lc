import React, { Component } from "react";
import { connect } from "react-redux";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";

import SearchIcon from "../../img/resource_icons/icon_search_bottle.png";
import BottleDollarIcon from "../../img/resource_icons/icon_bottle_dollar.png";
import FindResourceListingItem from "../../components/FindResourceListingItem";
import SearchBar from "../../components/SearchBar";
import * as actionCreator from "../../store/actions/actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import {getListings} from "../../store/actions/actions";

class FindResourcePage extends Component {
    state = {
        search: "",
    };


    componentDidMount() {
        this.props.dispatchListings();
        this.updateNotifications();

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateNotifications() {
        this.interval = setInterval(() => {
            this.props.dispatchListings();
        }, 10000);
    }


    handleSearch = (searchValue) => {
        this.setState({ search: searchValue });
    };

    displayListings = () => {
        return this.props.allListings.length > 0
            ? this.props.allListings
                  .filter((item) => {
                      if (this.state.search.length === 0) {
                          return item;
                      } else if (
                          item.listing.name
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase()) ||
                          item.org._key.toLowerCase().includes(this.state.search.toLowerCase())
                      ) {
                          return item;
                      }
                  })
                  .map((item, index) => (
                      <ErrorBoundary key={index}>
                          <FindResourceListingItem key={item.listing._id} item={item} />
                      </ErrorBoundary>
                  ))
            : "Loading, no resources yet...";
    };

    render() {
        return (
            <>
                <HeaderDark />
                <Sidebar />

                <div className="container">
                    <div className="row mt-5" style={{ marginTop: "80px" }}>
                        <div className="col-md-6 col-sm-12 mt-3 mb-3" align="center">
                            <div className="icon-holder">
                                <Image className="p-4" src={SearchIcon} rounded height="240px" />
                            </div>
                            <h1 className="mt-3 blue-text">Find Products</h1>
                            <p>
                                Have specific requirements? Create a search. We’ll notify you when
                                you receive a match.
                            </p>
                            <Link to="/search-form" className="btn btn-green">
                                Create a search
                            </Link>
                        </div>
                        <div className="col-md-6 col-sm-12 mt-3 mb-3" align="center">
                            <Image className="p-4" src={BottleDollarIcon} rounded height="240px" />
                            <h1 className="mt-3 blue-text">Sell Products</h1>
                            <p>
                                Have a resource to sell? Create a new listing and we’ll notify you
                                when you receive a match.
                            </p>
                            <Link to="/list-form" className="btn btn-green">
                                Create a Listing
                            </Link>
                        </div>
                    </div>

                    <hr />

                    <div className="row mt-5 mb-2">
                        <div className="col">
                            <h2 className="text-md-center blue-text">View all Listings</h2>
                        </div>
                    </div>

                    <div className="row  justify-content-center search-container  pt-3 pb-4">
                        <div className={"col-12"}>
                            <SearchBar
                                dropDown dropDownValues={PRODUCTS_FILTER_VALUES}
                                onSearch={(e) => this.handleSearch(e)}
                            />
                        </div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-12">{this.displayListings()}</div>
                    </div>
                </div>

                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        allListings: state.allListings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        dispatchListings: (data) => dispatch(actionCreator.getListings()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindResourcePage);

import React, {Component} from "react";
import {connect} from "react-redux";
import {Image} from "react-bootstrap";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import Footer from "../../components/Footer/Footer";
import {PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import SearchBar from "../../components/SearchBar";
import * as actionCreator from "../../store/actions/actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import BuyProduct from "../../img/icons/buy-products-icon-blue.png";
import SellProduct from "../../img/icons/sell-products-icon-blue.png";
import BlueBorderLink from "../../components/FormsUI/ProductForm/BlueBorderLink";
import MarketplaceResourceItem from "../../components/Resources/MarketplaceResourceItem";

const currentTime = new Date();

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
                .filter(item => item.listing.available_from_epoch_ms < currentTime.getTime() && item.listing.expire_after_epoch_ms > currentTime.getTime())
                  .map((item, index) => (
                      <ErrorBoundary key={index}>
                          {/*<FindResourceListingItem key={item.listing._id} item={item} />*/}
                          <MarketplaceResourceItem
                              // triggerCallback={() => this.callBackResult()}
                              // history={this.props.history}
                              link={"/" + item.listing._key}
                              item={item}
                              key={index}
                              hideMoreMenu
                          />
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
                        <div className="col-12 web-only icon-container" >

                            <div className="icon-bg icon-holder">
                                <Image className="" src={BuyProduct} rounded

                                />

                            <h3 className="mt-2 blue-text icon-title">Buy Products</h3>
                            <span className="text-gray-light">
                                Search for a specific product and we’ll notify you <br/>when you get a match.
                            </span>
                            <BlueBorderLink title="New search" to="/search-form"  />


                            </div>
                            <div className="icon-bg icon-holder">
                            <Image className="" src={SellProduct} rounded

                            />
                            <h3 className="mt-2 blue-text icon-title">Sell Products</h3>
                            <span className="text-gray-light">
                                List a new product for sale and we’ll notify you <br/>when you get a match.

                            </span>
                                <BlueBorderLink title="New Listing" to="/list-form"  />

                            </div>


                        </div>
                    </div>


                    <div className="row mt-5 mb-2">
                        <div className="col">
                            <h4 className="blue-text text-heading">View All Listings</h4>
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

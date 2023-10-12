import React, {Component} from "react";
import {connect} from "react-redux";
import ShippingWhite from "../../img/icons/delivery-blue.png";
import SettingsWhite from "../../img/icons/settings-blue.png";
import SearchWhite from "../../img/icons/search-blue.png";
import VerticalLines from "../../img/icons/stat-blue-2.png";
import Rings from "../../img/icons/ring-blue.png";
import BuildingIcon from "../../img/icons/building-icon.png";
import ProductBlue from "../../img/icons/product-blue.png";
import ListingBlue from "../../img/icons/listing-blue.png";
import {Link} from "react-router-dom";
import HeaderDark from "../../views/header/HeaderDark";
import Sidebar from "../../views/menu/Sidebar";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ErrorBoundary from "../../components/ErrorBoundary";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <ErrorBoundary skip>
            <div>
                <Sidebar />
                <div className="wrapper  ">
                    <HeaderDark />

                    <div className="container  pt-3">
                        <div className="row mb-3 justify-content-center ">
                            <div className="col-12  justify-content-center">
                                <h4 className={"text-blue text-bold"}>My Loopcycle</h4>
                            </div>
                        </div>

                        <div className="row mb-5 justify-content-center account-header-box">
                            <div className="col-6  justify-content-center">
                                <h5 className={"text-blue text-bold"}>
                                    {this.props.userDetail.orgId}
                                </h5>
                                <p className={" text-mute small"}>
                                    Joined in 2010
                                    <br />
                                    Surrey, UK
                                </p>
                            </div>

                            <div className="col-6   justify-content-center">
                                <div className="figure-profile account-figure shadow ">
                                    <figure>
                                        <Link to={"/company"}>
                                            <img src={BuildingIcon} alt="" />
                                        </Link>
                                    </figure>
                                </div>
                                <p className={"text-blue text-underline text-upload"}>
                                    Upload Photo
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">
                                    <Link className="list-group-item list-group-item-action ">
                                        <img
                                            src={SettingsWhite}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Account <NavigateNextIcon />
                                    </Link>
                                    <Link
                                        to={"my-search"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={SearchWhite}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Searches <NavigateNextIcon />
                                    </Link>

                                    <Link
                                        to={"/my-listings"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={ListingBlue}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Listings <NavigateNextIcon />
                                    </Link>

                                    <Link
                                        to={"/loops"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={Rings}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Cycles <NavigateNextIcon />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container ">
                        <div className="row"></div>
                    </div>

                    <div className="container   pt-4">
                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu accountpage-list">
                                    <Link
                                        to={"/my-products"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={ProductBlue}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Products <NavigateNextIcon />
                                    </Link>

                                    <Link
                                        to={"/my-deliveries"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={ShippingWhite}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Deliveries <NavigateNextIcon />
                                    </Link>

                                    <Link
                                        to={"/statistics"}
                                        className="list-group-item list-group-item-action ">
                                        <img
                                            src={VerticalLines}
                                            className={"account-icons truck-icon "}
                                            alt=""
                                        />
                                        Statistics <NavigateNextIcon />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </ErrorBoundary>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);

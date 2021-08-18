import React, { Component } from "react";
import { connect } from "react-redux";
import PhoneHome from "../../img/phone-home.png";
import BikeHome from "../../img/LoopBike.png";
import LoopHomeImage from "../../img/loop-home-image.png";
import HandIcon from "../../img/icons/hand.png";
import SearchIcon from "../../img/icons/search-icon.png";
import ShippingIcon from "../../img/icons/shipping-icon.png";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import Footer from "../Footer/Footer";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import * as actionCreator from "../../store/actions/actions";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };

        this.goToResources = this.goToResources.bind(this);
        this.goToList = this.goToList.bind(this);
        this.goToSearch = this.goToSearch.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
    }

    interval;


    goToResources() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/find-resources");
        }
    }

    goToSearch() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/search-form");
        }
    }

    goToList() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        } else {
            this.props.history.push("/list-form");
        }
    }

    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }

    render() {
        return (
            <div>
                <Sidebar />
                <HeaderDark />
                <div className="wrapper homepage">
                    <div className="container-fluid  pt-5">
                        <div className="container   pt-5 pb-5">

                            <div className="row no-gutters">
                                <div className="col-md-6 col-sm-12 col-xs-12  pt-4">
                                    <div className="row no-gutters">
                                        <div className="col-12">
                                            <h1 className="blue-text primary-heading" style={{fontSize: "3em"}}>
                                                Connect the dots
                                            </h1>
                                        </div>

                                        <div className="col-12">
                                            <div className="row no-gutters">
                                                <p className="blue-text" style={{fontSize: "1.3em"}}>
                                                    Loopcycle’s product traceability platform redefines the management,
                                                    recovery and resale of valuable secondary products, driving integrity
                                                    within the reuse market.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row no-gutters mt-4 web-only">
                                        <div className="col-auto">
                                            <a
                                                href="https://loopcycle.io/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                type="button"
                                                style={{ textDecoration: "none", color: "#3F3C6E" }}
                                                className="mr-2 btn btn-link blue-btn-border mt-2 mb-2">
                                                Learn more <NavigateNextIcon />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-12 col-xs-12 ">
                                    <img className="img-fluid" src={PhoneHome} alt="" />
                                </div>

                                <div className="col-12 mobile-only pt-4">
                                    <p className="white-text">
                                        Loopcycle uses artificial intelligence to match
                                        organizations and blockchain technology is used to ensure
                                        the transaction is secure and traceable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid container-blue pt-5">
                        <div className="container   pt-5 pb-5">
                            <div className="row  pt-4">
                                <div className="col-md-6 col-sm-12 col-xs-12 mb-4 ">
                                    <div className="row no-gutters justify-content-center">
                                        <div className="col-10">
                                            <img className={"img-fluid"} src={BikeHome} alt="" />
                                        </div>
                                    </div>

                                    <div className="row no-gutters justify-content-center">
                                        <div className="col-10">
                                            <h3 className="white-text mt-4 primary-heading">
                                                Do more, with less
                                            </h3>

                                            <p className={"white-text mt-4"}>
                                                Resource exchange is just part of the process.
                                                Loopcycle is a platform for building relationships.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-12 col-xs-12 mb-4 ">
                                    <div className="row no-gutters justify-content-center">
                                        <div className="col-10">
                                            <img
                                                className={"img-fluid"}
                                                src={LoopHomeImage}
                                                alt=""
                                            />
                                        </div>
                                    </div>

                                    <div className="row no-gutters justify-content-center">
                                        <div className="col-10">
                                            <h3 className="white-text mt-4 primary-heading">
                                                Igniting community
                                            </h3>
                                            <p className={"white-text mt-4"}>
                                                We’re closing the loop on excess material
                                                extraction; breaking the ‘take, make waste’ cycle
                                                and empowering creators to do more, with less.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-5 mb-5 ">
                        <div className="row no-gutters justify-content-center">
                            <div className="col-auto">
                                <h3 className={"blue-text text-center "}>
                                    <b>
                                        View all resources on the <br />
                                        Loopcycle Platform
                                    </b>
                                </h3>
                            </div>
                        </div>

                        <div className="row no-gutters justify-content-center mt-4">
                            <div className="col-auto">
                                <button
                                    onClick={this.goToResources}
                                    type="button"
                                    className="shadow-sm mr-2 btn btn-link blue-btn mt-2 mb-2 btn-blue">
                                    Browse all resources <NavigateNextIcon />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="container ">
                        <div className="row container-divider"></div>
                    </div>
                    <div className="container  mb-5 mt-5 web-only">
                        <div className="row no-gutters mb-3 justify-content-center">
                            <div className="col-4">
                                <img className={"search-icon"} src={SearchIcon} alt="search" />
                                <p className={"blue-text mt-4"}>
                                    Need resources to make your product? Start a search and enter
                                    your requirements.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/search-form"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a search
                                </Link>
                            </div>

                            <div className="col-4">
                                <img className={"home-icon"} src={HandIcon} alt="listing" />
                                <p className={"blue-text mt-4"}>
                                    Do you have used resources to offer? Start listing any used
                                    resources.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/list-form"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a listing
                                </Link>
                            </div>

                            <div className="col-4">
                                <img className={"home-icon"} src={ShippingIcon} alt="resources" />
                                <p className={"blue-text mt-4"}>
                                    Able to collect and deliver resources? Register your company on
                                    the platform.
                                </p>
                                <Link
                                    onClick={this.showLoginPopUp}
                                    to={this.props.isLoggedIn && "/"}
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Deliver Resources
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="container  mobile-only">
                        <div className="row no-gutters mb-3 mt-5">
                            <div className="col-auto">
                                <img className={"search-icon"} src={SearchIcon} alt="search" />
                            </div>
                        </div>
                        <div className="row no-gutters  mb-3">
                            <div className="col-auto">
                                <p className={"blue-text"}>
                                    Need resources to make your product? Start a search and enter
                                    your requirements.
                                </p>
                            </div>
                        </div>

                        <div className="row no-gutters mb-5">
                            <div className="col-auto">
                                <button
                                    onClick={this.goToSearch}
                                    type="button"
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a search
                                </button>
                            </div>
                        </div>

                        <div className="row container-divider"></div>

                        <div className="row no-gutters mt-5  mb-3">
                            <div className="col-auto">
                                <img className={"home-icon"} src={HandIcon} alt="resources" />
                            </div>
                        </div>
                        <div className="row no-gutters mb-3 ">
                            <div className="col-auto">
                                <p className={"blue-text"}>
                                    Do you have used resources to offer? Start listing any used
                                    resources.
                                </p>
                            </div>
                        </div>

                        <div className="row no-gutters mb-5">
                            <div className="col-auto">
                                <button
                                    onClick={this.goToList}
                                    type="button"
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Create a listing
                                </button>
                            </div>
                        </div>
                        <div className="row container-divider"></div>

                        <div className="row no-gutters mt-5 mb-3">
                            <div className="col-auto">
                                <img className={"home-icon"} src={ShippingIcon} alt="home" />
                            </div>
                        </div>
                        <div className="row no-gutters mb-3">
                            <div className="col-auto">
                                <p className={"blue-text"}>
                                    Able to collect and deliver resources? Register your company on
                                    the platform.
                                </p>
                            </div>
                        </div>

                        <div className="row no-gutters mb-5">
                            <div className="col-auto">
                                <button
                                    type="button"
                                    className=" mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                    Deliver Resources
                                </button>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Home);

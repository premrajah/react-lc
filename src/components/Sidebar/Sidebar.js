import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Close from "@mui/icons-material/Close";

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this);
    }

    toggleMenu = (event) => {
        document.body.classList.remove("sidemenu-open");
    };

    showSignUpPopUp = (event) => {
        document.body.classList.remove("sidemenu-open");

        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);
    };

    showLoginPopUp = (event) => {
        document.body.classList.remove("sidemenu-open");

        this.props.setLoginPopUpStatus(0);
        this.props.showLoginPopUp(true);
    };

    logOut = (event) => {
        document.body.classList.remove("sidemenu-open");
        this.props.logOut();
    };

    handleSongLoading() {}

    handleSongFinishedPlaying() {}

    handleSongPlaying() {}

    interval;


    render() {
        return (
            <>
                <div className="sidebar">
                    <div className="row container-black pt-2 pb-2"></div>
                    <div className="sidebar-container">
                        <div className="row mt-3">
                            <div className="col">
                                <a href="#!" className="closesidemenu">
                                    <Close
                                        onClick={this.toggleMenu}
                                        className="white-text"
                                        style={{ fontSize: 32 }}
                                    />
                                </a>
                            </div>
                        </div>

                        {this.props.isLoggedIn && (
                            <div className="row mt-2">
                                <div className="col">
                                    <div className="list-group main-menu">
                                        <Link to="#!" className="list-group-item list-group-item-action green-text">
                                            Hello, {this.props.userDetail.firstName}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {this.props.isLoggedIn && (
                            <div className="mt-2 mb-3">
                                <div className="row">
                                    <div className="col-auto">
                                        <figure className="avatar avatar-60 border-0">
                                            <span className={"word-user-big"}>
                                                {this.props.userDetail &&
                                                    this.props.userDetail.orgId &&
                                                    this.props.userDetail.orgId.substr(0, 2)}
                                            </span>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        )}
                        {this.props.isLoggedIn && (
                            <div className="row">
                                <div className="col">
                                    <div className="list-group main-menu">
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/"}
                                            className="white-text list-group-item list-group-item-action">
                                            Home
                                        </Link>

                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/account"}
                                            className="white-text list-group-item list-group-item-action">
                                            Account
                                        </Link>

                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/find-resources"}
                                            className="white-text list-group-item list-group-item-action">
                                            Browse Resources
                                        </Link>
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/search-form"}
                                            className="white-text list-group-item list-group-item-action">
                                            Create A Search
                                        </Link>
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/list-form"}
                                            className="white-text list-group-item list-group-item-action">
                                            Create A Listing
                                        </Link>

                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/my-cycles"}
                                                className="white-text list-group-item list-group-item-action">
                                                Cycles
                                            </Link>


                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/my-listings"}
                                                className="white-text list-group-item list-group-item-action">
                                                Listings
                                            </Link>


                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/my-search"}
                                                className="white-text list-group-item list-group-item-action">
                                                Searches
                                            </Link>
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/sites"}
                                            className="white-text list-group-item list-group-item-action">
                                            Sites
                                        </Link>

                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/my-products"}
                                                className="white-text list-group-item list-group-item-action">
                                                Products
                                            </Link>
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/my-campaigns"}
                                            className="white-text list-group-item list-group-item-action">
                                            Campaigns
                                        </Link>

                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/approve"}
                                                className="white-text list-group-item list-group-item-action">
                                                Approvals
                                            </Link>
                                        <Link
                                            onClick={this.toggleMenu}
                                            to={"/help"}
                                            className="white-text list-group-item list-group-item-action">
                                            Help
                                        </Link>
                                            <Link
                                                onClick={this.toggleMenu}
                                                to={"/issues"}
                                                className="white-text list-group-item list-group-item-action">
                                                Issues
                                            </Link>


                                    </div>
                                </div>
                            </div>
                        )}
                        {this.props.isLoggedIn && (
                            <div className="row mt-3 mb-3">
                                <div className="col">
                                    <div className={"menu_divider_line"}></div>
                                </div>
                            </div>
                        )}

                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu">
                                    {!this.props.isLoggedIn && (
                                        <>
                                            <Link
                                                onClick={this.showLoginPopUp}
                                                to={""}
                                                className="list-group-item list-group-item-action green-text">
                                                Log In
                                            </Link>

                                            <Link
                                                onClick={this.showSignUpPopUp}
                                                to={""}
                                                className="list-group-item list-group-item-action green-text">
                                                Sign Up
                                            </Link>
                                        </>
                                    )}

                                    {this.props.isLoggedIn && (
                                        <Link
                                            onClick={this.logOut}
                                            to={""}
                                            className="list-group-item list-group-item-action green-text">
                                            Log Out
                                        </Link>
                                    )}
                                    <Link
                                        onClick={this.toggleMenu}
                                        to={"/account"}
                                        className="list-group-item list-group-item-action green-text">
                                        My Loopcycle
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Sidebar);

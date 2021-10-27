import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

class NotFound extends Component {


    constructor(props) {
        super(props);

    }


    showProductSelection=()=> {
        this.props.showProductPopUp({ type: "create_product", show: true, id:this.props.slug });
    }

    showLoginPopUp = (event) => {
        this.props.setLoginPopUpStatus(0);
        this.props.showLoginPopUp(true);
    };

    showSignUpPopUp = (event) => {
        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);
    };

    render() {
        return (
            <>
                <Sidebar />
                <HeaderDark />
                <section className="not-found mb-4 mt-5 pt-5">
                    <div className="container mt-5 pt-5">
                        <div className="row justify-content-center">
                            {!this.props.qrCodeNotFound ?
                                <div className="col-lg-8">
                                <h1>404</h1>
                                <h2>Oops! This Page Could Not Be Found</h2>
                                <p>
                                    Sorry but the page you are looking for does not exist, has been
                                    moved, name changed or is temporarily unavailable
                                </p>
                                <Link to="/" className="mt-1 btn blue-btn">
                                    HOME
                                </Link>
                            </div>:
                                <div className="col-lg-8">
                                    <h1>404</h1>
                                    <p>
                                        Oops! This product you are looking for could not be found.
                                    </p>
                                    {this.props.isLoggedIn ?
                                        <>
                                                <div className="row justify-content-start pb-3 pt-3 ">
                                                    <div className="col-6 ">
                                                        <Link
                                                            onClick={this.showProductSelection}
                                                            to={this.props.isLoggedIn && "/my-products"}
                                                            className="  blue-btn-border mt-2 mb-2">
                                                            Add Product
                                                        </Link>
                                                    </div>
                                                    <div className="col-6 ">
                                                        <Link

                                                            to={"/my-products"}

                                                            // onClick={this.showRegister}
                                                            className={
                                                                "  blue-btn-border mt-2 mb-2"
                                                            }>
                                                            View Products
                                                        </Link>
                                                    </div>
                                                </div>

                                        </>:
                                        <>
                                            <div className="row justify-content-start pb-3 pt-3 ">
                                                <div className="col-6 ">
                                                    <Link
                                                        onClick={this.showSignUpPopUp}
                                                        to={this.props.isLoggedIn && "/my-products"}
                                                        className="  blue-btn-border mt-2 mb-2">
                                                        Sign Up
                                                    </Link>
                                                </div>
                                                <div className="col-6 ">
                                                    <Link

                                                        onClick={this.showLoginPopUp}
                                                        className={
                                                            "  blue-btn-border mt-2 mb-2"
                                                        }>
                                                        Log In
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    }

                                </div>



                            }
                        </div>
                    </div>
                </section>
            </>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(NotFound);

import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import LogoNew from "../../img/logo-cropped.png";
import LogoText from "../../img/logo-text.png";
import { Link } from "react-router-dom";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import RecoverPassword from "./RecoverPassword";
import SignUp from "./SignUp";
import SuccessSignUp from "./SuccessSignUp";
import ForgotPassword from "./ForgotPassword";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

class LoginPopUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            errors: {},
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
        };

        this.hideLoginPopUp = this.hideLoginPopUp.bind(this);
    }

    hideLoginPopUp = (event) => {
        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false);
    };

    // goHome(){
    //
    //     history.push("/")
    // }
    //
    //


    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
    }

    render() {
        return (
            <>
                <div className={"body-overlay"}>
                    <div className={"modal-popup"}>
                        <div className=" text-right web-only">
                            {/*<Link to={"/"}>*/}

                                <Close
                                    onClick={this.hideLoginPopUp}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            {/*</Link>*/}
                        </div>
                        <div className="container  p-2 mobile-only"></div>
                        <div className="container  pt-2 pb-3 mobile-only">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <img src={LogoNew} alt="" className="header-logo" />
                                    <img className={"text-logo-home-right"} src={LogoText} alt="" />
                                </div>

                                <div className="col text-right">
                                    <Link to={"/"}>

                                        <Close
                                            onClick={this.hideLoginPopUp}
                                            className="blue-text"
                                            style={{ fontSize: 32 }}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {this.props.loginPopUpStatus === 0 && <Login />}
                        {this.props.loginPopUpStatus === 1 && <SignUp />}
                        {this.props.loginPopUpStatus === 2 && <ForgotPassword />}

                        {this.props.loginPopUpStatus === 3 && <RecoverPassword />}
                        {this.props.loginPopUpStatus === 4 && <ResetPassword />}
                        {this.props.loginPopUpStatus === 5 && <SuccessSignUp />}
                    </div>
                </div>
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

        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(LoginPopUp);

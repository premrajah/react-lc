import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import LogoNew from "../../img/logo-cropped.png";
import LogoText from "../../img/logo-text.png";
import { Link } from "react-router-dom";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";


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

    }

    hidePopUp = (event) => {
        // document.body.classList.add('sidemenu-open');
        this.props.showLoginPopUp(false);
    };



    // goToSignIn() {
    //     this.setState({
    //         active: 0,
    //     });
    // }
    //
    // goToSignUp() {
    //     this.setState({
    //         active: 1,
    //     });
    // }

    render() {
        return (
            <>
                <div className={"body-overlay"}>
                    <div className={"modal-popup"}>
                        <div className=" text-right web-only">
                            <Link to={"/"}>

                                <Close
                                    onClick={this.hidePopUp}
                                    className="blue-text"
                                    style={{ fontSize: 32 }}
                                />
                            </Link>
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

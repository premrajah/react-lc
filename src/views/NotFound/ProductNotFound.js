import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import PageHeader from "../../components/PageHeader";
import CubeBlue from "../../img/icons/product-icon-big.png";
import GreenButton from "../../components/FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import BlueBorderLink from "../../components/FormsUI/Buttons/BlueBorderLink";

class ProductNotFound extends Component {


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

                <section className="not-found ">

                    <div className="container mt-4 pt-4">
                        <PageHeader
                            paddingLeftZero
                            pageIcon={CubeBlue}
                            pageTitle="Product Provenance"
                            subTitle="See product details and provenance"
                        />
                        <div className="row justify-content-center">

                                <div className="col-lg-12 text-center">

                                    <p className={"text-gray-light"}>
                                       The product you are looking for could not be found. But you can create add new product by login or registering on our platform.
                                    </p>

                                    {this.props.isLoggedIn ?
                                        <>
                                            <div className="row justify-content-center pb-3 pt-3 ">
                                                <div className="col-3 ">
                                                    <GreenButton
                                                        title={"Add Product"}
                                                        onClick={this.showProductSelection}
                                                        to={this.props.isLoggedIn && "/my-products"}

                                                    >

                                                    </GreenButton>
                                                </div>
                                                <div className="col-3 ">
                                                    <BlueBorderLink
                                                        title={"View Products"}
                                                        to={"/my-products"}
                                                        // onClick={this.showRegister}

                                                    >

                                                    </BlueBorderLink>
                                                </div>
                                            </div>

                                        </>:
                                        <>
                                            <div className="row justify-content-center pb-3 pt-3 ">
                                                <div className="col-3 ">
                                                    <GreenButton
                                                        title={"Sign Up"}
                                                        onClick={this.showSignUpPopUp}
                                                        to={this.props.isLoggedIn && "/my-products"}
                                                       >

                                                    </GreenButton>
                                                </div>
                                                <div className="col-3">
                                                    <BlueBorderButton
                                                      title={"Log in"}
                                                        onClick={this.showLoginPopUp}

                                                    >
                                                    </BlueBorderButton>
                                                </div>
                                            </div>
                                        </>
                                    }

                                </div>

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
export default connect(mapStateToProps, mapDispachToProps)(ProductNotFound);

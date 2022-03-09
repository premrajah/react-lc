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



                    <div className="container pb-4 pt-4">
                        <PageHeader
                            paddingLeftZero
                            pageIcon={CubeBlue}
                            pageTitle="Product Provenance"
                            subTitle="See product details and provenance"
                        />
                        <div className="row justify-content-center">

                                <div className="col-lg-12 text-center">

                                    <p className={"text-gray-light"}>
                                        An open cyclecode!   <br/>This product has no details yet.
                                        <br/>

                                        Click add product to register these details.

                                        You will only be able to add the product details if you are logged in.                                    </p>


                                        <>
                                            <div className="row justify-content-center pb-3 pt-3 ">
                                                <div className="col-md-3 mt-3 ">
                                                    <GreenButton
                                                        title={"Add Product"}
                                                        onClick={this.props.isLoggedIn?this.showProductSelection:this.showLoginPopUp}
                                                        to={this.props.isLoggedIn?"/my-products":"#"}

                                                    >

                                                    </GreenButton>
                                                </div>
                                                <div className="col-md-3 mt-3">
                                                    <BlueBorderLink
                                                        title={"View Products"}
                                                        onClick={this.props.isLoggedIn?"":this.showLoginPopUp}

                                                        to={this.props.isLoggedIn?"/my-products":"#"}
                                                        // onClick={this.showRegister}
                                                    >

                                                    </BlueBorderLink>
                                                </div>
                                            </div>

                                        </>


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

import React, {Component} from "react";

import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";

import {makeStyles} from "@mui/styles";

import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import ProductDetailCycle from "../../components/ProductDetailCycle";
import PageHeader from "../../components/PageHeader";
import NotFound from "../NotFound";
import Layout from "../../components/Layout/Layout";
import ProductDetailContent from "../../components/Products/ProductDetailContent";
import ProductNotFound from "../NotFound/ProductNotFound";

class ItemCycleDetail extends Component {
    slug;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            codeImg: null,
            searches: [],
            fields: {},
            errors: {},
            active: 0, //0 logn. 1- sign up , 3 -search,
            formValid: false,
            notFoundError:false
        };

        this.slug = props.match.params.slug;

        this.getResources = this.getResources.bind(this);
        this.getQrCode = this.getQrCode.bind(this);
        this.loadSearches = this.loadSearches.bind(this);
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this);
    }

    showSignUpPopUp = (event) => {
        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    handleValidationSubmitGreen() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            // errors["password"] = "Required";
        }

        if (!fields["email"]) {
            formIsValid = false;
            // errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                // errors["email"] = "Invalid email address";
            }
        }

        this.setState({ formValid: formIsValid });
    }

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }

        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {
            let lastAtPos = fields["email"].lastIndexOf("@");
            let lastDotPos = fields["email"].lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    fields["email"].indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    fields["email"].length - lastDotPos > 2
                )
            ) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        this.handleValidationSubmitGreen();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true,
            });

            const data = new FormData(event.target);

            const username = data.get("email");
            const password = data.get("password");

            this.props.logIn({ email: username, password: password });
        } else {
        }
    };

    loadSearches() {}

    getQrCode() {
        axios.get(baseUrl + "product/" + this.slug + "/code").then(
            (response) => {
                var response = response.data;

                this.setState({
                    codeImg: response,
                });
            },
            (error) => {
                var status = error.response.status;
            }
        );
    }

    getResources() {

        var url = baseUrl + "code/" + this.slug + "/expand?agg";

        axios
            .get(url)
            .then(
                (response) => {
                    var responseData = response.data.data;

                    this.setState({
                        item: responseData,
                        notFoundError:false
                    });

                    //
                    // this.loadSearches()
                    // this.getQrCode()
                },
                (error) => {


                    if (error&&error.response&&error.response.status===404){

                   this.setState({
                       notFoundError:true
                   })
                    }


                }
            );
    }


    showProductSelection=()=> {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.getResources();
    }

    render() {
        return (

            <Layout>
            {this.state.notFoundError ? (
                <ProductNotFound slug={this.slug} qrCodeNotFound={true} />
                ) :
                    <div className={"container pb-5 mb-5"}>
                        {this.state.item && (
                            <>
                                <ProductDetailCycle
                                    showRegister={true}
                                    item={this.state.item}
                                />
                            </>
                        )}
                    </div>

            }


            {/*<div>*/}
            {/*    <Sidebar />*/}
            {/*    <div className="accountpage">*/}
            {/*        <HeaderDark />*/}

            {/*        <div className="container ">*/}
            {/*            {!this.state.notFoundError? <div>*/}
            {/*                <PageHeader*/}
            {/*                    pageTitle="Product Details (Provenance)"*/}
            {/*                    subTitle="See product details and Provenance."*/}
            {/*                />*/}

            {/*                {this.state.item && (*/}
            {/*                    <>*/}
            {/*                        <ProductDetailCycle*/}
            {/*                            showRegister={true}*/}
            {/*                            item={this.state.item}*/}
            {/*                        />*/}
            {/*                    </>*/}
            {/*                )}*/}
            {/*            </div>:*/}
            {/*            <NotFound slug={this.slug} qrCodeNotFound={true} />*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

                </Layout>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "6px 16px",
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

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
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
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
export default connect(mapStateToProps, mapDispachToProps)(ItemCycleDetail);

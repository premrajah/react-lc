import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import encodeUrl from "encodeurl";
import NotFound from "../../components/NotFound/index";
import Layout from "../../components/Layout/Layout";
import ProductKindDetailContent from "../../components/ProductKind/ProductKindDetailContent";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";

class ProductKindDetail extends Component {
    slug;
    search;
    constructor(props) {
        super(props);
        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            subProducts: [],
            currentProductKind: null,
            loading: false,
            notFound: false,
            paramsString: null
        };

        this.slug = props.match.params.slug;
        this.search = props.match.params.search;
    }

    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.match.params.slug !== this.props.match.params.slug) {
            this.slug = newProps.match.params.slug;
            window.scrollTo(0, 0);
            this.props.loadCurrentProduct(encodeUrl(this.slug));

        }
    }



    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };



    loadCurrentProduct = (data) => {

        this.props.loading(true)
        this.setState({
            loading: true
        })
        try {
            axios
                .get(`${baseUrl}product-kind/${encodeUrl(data)}`)
                .then(
                    (response) => {
                        let responseAll = response.data.data;
                        // console.log(">> ", responseAll);
                        this.props.setCurrentProductKind(responseAll)
                        this.props.loading(false)
                        this.setState({
                            loading: false
                        })

                    },
                    (error) => {
                        console.log("product-kind error inside ", error);
                        this.setState({
                            loading: false
                        })

                        this.props.loading(false)
                    }
                );

        } catch (e) {
            console.log("product-kind error outside ", e)
        }
    };


    componentDidMount() {

        this.loadCurrentProduct(encodeUrl(this.slug), true);
        
    }

    setParams = (params) => {

        this.setState({
            paramsString: params
        })

    }

    render() {


        return (
            <>
                {!this.state.loading &&
                    !this.props.currentProductKind ? (
                    <NotFound />
                ) :
                    <>
                        {!this.props.location.pathname.includes("preview") ?
                            <Layout hideFooter={true} sendParams={this.setParams}>
                                <div className={"container pb-5 mb-5"}>
                                    {!this.state.loading && this.props.currentProductKind &&
                                        <ProductKindDetailContent
                                            history={this.props.history}
                                            hideRegister={true}
                                            paramsString={this.state.paramsString}
                                            item={this.props.currentProductKind}
                                        />}

                                </div>
                            </Layout> :
                            <div className={"container pb-5 mb-5"}>
                                {!this.state.loading && this.props.currentProductKind &&
                                    <ProductKindDetailContent
                                        paramsString={this.state.paramsString}
                                        history={this.props.history}
                                        hideRegister={true}
                                        item={this.props.currentProductKind}
                                    />}

                            </div>}
                    </>
                }
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
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        currentProductKind: state.currentProductKind,
        productNotFound: state.productNotFound,

    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loading: (data) => dispatch(actionCreator.loading(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadCurrentProduct: (data) => dispatch(actionCreator.loadCurrentProduct(data)),
        setCurrentProductKind: (data) => dispatch(actionCreator.setCurrentProductKind(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductKindDetail);

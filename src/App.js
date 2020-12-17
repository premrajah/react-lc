import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'
import './css/style.css';
// import './css/style-2.scss';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, withRouter,  BrowserRouter } from "react-router-dom";

import Home from "./views/LoopHome/Home";
import Inbox from "./views/inbox/index";
import LoginPopUp from "./views/login/LoginPopUp";
import Account from "./views/account/Account";
import CompanyPage from "./views/loop-cycle/company-page";
import MySearch from "./views/loop-cycle/MySearch";


import MyListingsOld from "./views/loop-cycle/MyListings";
import ItemDetail from "./views/browser-resources/ItemDetail";
import ItemCycleDetail from "./views/browser-resources/ItemCycleDetail";
import Products from "./views/loop-cycle/Products";
import ProductDetail from "./views/loop-cycle/ProductDetail";
import CreateProduct from "./views/create-product/create-product";
import MyDeliveries from "./views/loop-cycle/MyDeliveries";
import Statistics from "./views/loop-cycle/Statistics";
import Loops from "./views/loop-cycle/Loops";
import LoopDetail from "./views/loop-cycle/LoopDetail";
import ViewCycle from "./views/loop-cycle/view-cycle";
import CreateSearchHome from "./views/create-search/Home";
import CreateListingHome from "./views/create-listing/Home";
import ListingForm from "./views/create-listing/ListingForm";
import CreateListing from "./views/create-listing/create-listing";
import SubProductView from "./views/create-listing/SubProductView";

import ProductView from "./views/create-listing/ProductView";


import ListForm from "./views/create-listing/ListForm";
import ProductForm from "./views/create-listing/ProductForm";
import SearchForm from "./views/create-search/SearchForm";
import ViewSearchNew from "./views/create-search/ViewSearch";
import SearchMatches from "./views/create-search/search-matches";
import AddDetail from "./views/create-search/AddDetail";
import DeliveryResource from "./views/delivery-resource/index";
import CycleCode from "./views/delivery-resource/CycleCode";
import BrowseResources from "./views/browser-resources/index";
import FindResources from "./views/browser-resources/FindResources";

import MessageSeller from "./views/browser-resources/message-seller";
import MakeOffer from "./views/browser-resources/make-offer";
import ItemDetailMatch from "./views/create-search/ItemDetail";

import Search from "./views/browser-resources/Search";
import Filter from "./views/browser-resources/Filter";

import AuthRoute from "./Util/AuthRoute";
import LoggedInRoute from "./Util/LoggedInRoute";
import {connect} from "react-redux";
import * as actionCreator from "./store/actions/actions";

import EditAccount from "./views/account/EditAccount";
import CompanyInfo from "./views/account/CompanyInfo";
import Address from "./views/account/Address";
import PaymentMethod from "./views/account/PaymentMethod";
import MyAccount from "./views/account/MyAccount";




var hist = createBrowserHistory();

class App extends Component{

    constructor(props) {
        super(props)

    }


    componentWillMount(){


        this.props.loadUserDetail()
    }
    render() {


        return (
            <>
                <BrowserRouter>
                {/*<Router history={hist}>*/}
                    <Switch>
                        <Route exact path="/" component={withRouter(Home)} />
                        <LoggedInRoute exact path="/inbox" component={withRouter(Inbox)} />
                        <LoggedInRoute exact path="/company" component={CompanyPage} />
                        <LoggedInRoute exact path="/my-search" component={MySearch} />
                        <LoggedInRoute exact path="/my-listings" component={MyListingsOld} />
                        <LoggedInRoute exact path="/statistics" component={Statistics} />
                        <LoggedInRoute exact path="/my-deliveries" component={MyDeliveries} />
                        <LoggedInRoute exact path="/my-products" component={Products} />
                        {/*<LoggedInRoute exact path="/create-product" component={CreateProduct} />*/}
                        <LoggedInRoute exact path="/loops" component={Loops} />
                        <LoggedInRoute exact path="/create-search" component={CreateSearchHome} />
                        <LoggedInRoute exact path="/create-listing" component={CreateListingHome} />
                        <LoggedInRoute exact path="/search-form" component={SearchForm} />
                        <LoggedInRoute exact path="/list-form" component={CreateListing} />
                        <LoggedInRoute exact path="/list-form-new" component={ListForm} />
                        <LoggedInRoute exact path="/product-form" component={ProductForm} />
                        <LoggedInRoute exact path="/product-form/:slug" component={ProductForm} />

                        <LoggedInRoute exact path="/add-detail" component={AddDetail} />
                        <LoggedInRoute exact path="/delivery-resource" component={DeliveryResource} />
                        <LoggedInRoute exact path="/code" component={CycleCode} />
                        <LoggedInRoute exact path="/find-resources" component={FindResources} />


                        <LoggedInRoute exact path="/account" component={MyAccount} />
                        <LoggedInRoute exact path="/payment" component={PaymentMethod} />
                        <LoggedInRoute exact path="/edit-account" component={EditAccount} />
                        <LoggedInRoute exact path="/company-info" component={CompanyInfo} />
                        <LoggedInRoute exact path="/addresses" component={Address} />

                        <LoggedInRoute exact path="/resources" component={BrowseResources} />
                        <LoggedInRoute exact path="/search/:slug" component={ViewSearchNew} />
                        <LoggedInRoute exact path="/search" component={Search} />
                        <LoggedInRoute exact path="/filter" component={Filter} />
                        <LoggedInRoute exact path="/loop-converted/:slug" component={LoopDetail} />
                        <LoggedInRoute exact path="/loop-detail/:slug" component={ViewCycle} />
                        <LoggedInRoute exact path="/product/:slug" component={ProductDetail} />

                        <LoggedInRoute exact path="/sub-product-view/:slug" component={SubProductView} />

                        <LoggedInRoute exact path="/product-view/:slug" component={ProductView} />

                        <LoggedInRoute exact path="/message-seller/:slug" component={MessageSeller} />
                        <LoggedInRoute exact path="/matches/:slug" component={SearchMatches} />
                        <LoggedInRoute exact path="/make-offer/:slug" component={SearchMatches} />

                        <Route exact path="/product-cycle-detail/:slug" component={ItemCycleDetail} />


                        <LoggedInRoute exact path="/match/:slug/:search" component={ItemDetailMatch} />
                        <LoggedInRoute exact path="/:slug" component={ItemDetail} />
                        <LoggedInRoute exact path="/:slug/:search" component={ItemDetail} />


                    </Switch>

                    {(this.props.showLoginPopUp) && <LoginPopUp/>}

                {/*</Router>*/}
                </BrowserRouter>
            </>
        );

    }
}

const mapStateToProps = state => {
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


const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),


    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(App);

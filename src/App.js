import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./css/style.css";
import {createBrowserHistory} from "history";
import {BrowserRouter, Route, Switch, withRouter} from "react-router-dom";
import Home from "./views/LoopHome/Home";
import LoginPopUp from "./views/login/LoginPopUp";
import CompanyPage from "./views/loop-cycle/company-page";
import MySearch from "./views/loop-cycle/MySearch";
import MyListingsOld from "./views/loop-cycle/MyListings";
import ItemDetail from "./views/browse-resources/ItemDetail";
import ItemCycleDetail from "./views/browse-resources/ItemCycleDetail";
import ProductsNew from "./pages/my-products/Products";
import Product from "./pages/product-detail/Product";
import ProductsService from "./views/loop-cycle/ProductsService";
import MyDeliveries from "./views/loop-cycle/MyDeliveries";
import Statistics from "./views/loop-cycle/Statistics";
import Loops from "./views/loop-cycle/Loops";
import MyCycles from "./views/loop-cycle/MyCycles";
import LoopDetail from "./views/loop-cycle/LoopDetail";
import ViewCycle from "./views/loop-cycle/view-cycle";
import CreateSearchHome from "./views/create-search/Home";
import CreateListingHome from "./views/create-listing/Home";
import CreateListing from "./views/create-listing/create-listing";
import SubProductView from "./views/create-listing/SubProductView";
// import ProductView from "./views/create-listing/ProductView";
import ListForm from "./views/create-listing/ListForm";
import SearchForm from "./views/create-search/SearchForm";
import ViewSearchNew from "./views/create-search/ViewSearch";
import SearchMatches from "./views/create-search/search-matches";
import AddDetail from "./views/create-search/AddDetail";
import DeliveryResource from "./views/delivery-resource/index";
import CycleCode from "./views/delivery-resource/CycleCode";
import BrowseResources from "./views/browse-resources/index";
import MessageSeller from "./views/browse-resources/message-seller";
import ItemDetailMatch from "./views/create-search/ItemDetailMatch";
import ItemDetailMatched from "./views/create-search/ItemDetailMatched";
import Search from "./views/browse-resources/Search";
import Filter from "./views/browse-resources/Filter";
import LoggedInRoute from "./Util/LoggedInRoute";
import {connect} from "react-redux";
import * as actionCreator from "./store/actions/actions";
import EditAccount from "./views/account/EditAccount";
import CompanyInfo from "./views/account/CompanyInfo";
import Address from "./views/account/Address";
import PaymentMethod from "./views/account/PaymentMethod";
import MyAccount from "./views/account/MyAccount";
import ProductPopUp from "./views/create-product/create-product-popup";
import NotFound from "./views/NotFound/index";
import TermsAndConditions from "./components/Terms/TermsAndConditions";
import Cookie from "./components/Terms/Cookie";
import Privacy from "./components/Terms/Privacy";
import AcceptableUse from "./components/Terms/AcceptableUse";
import TermsAndService from "./components/Terms/TermsAndService";
import FindResourcePage from "./views/browse-resources/FindResourcePage";
import ProductArchive from "./views/product-archive/ProductArchive";
import ProductTreeView from "./components/ProductTreeView";
import Approvals from "./pages/approvals/Approvals";
import Issues from "./views/issues/Issues";
import IssueDetail from "./views/issues/IssueDetail";
import ApprovedReleases from "./pages/approvals/ApprovedReleases";
import NotificationPage from "./components/Inbox/NotificationPage";
import MessagePage from "./components/Inbox/MessagePage";
import TrackedProducts from "./components/Products/TrackedProducts";
import CustomSnackbar from "./components/UIComponents/CustomSnackbar";
import ResourceItem from "./components/Resources/ResourceItem";
import RegisterRecord from "./views/approvals/RegisterRecord";
import ServiceAgentRecord from "./views/approvals/ServiceAgentRecord";
import SearchRecords from "./components/Searches/SearchRecords";
import ListingRecord from "./components/Listings/ListingRecord";

let hist = createBrowserHistory();

class App extends Component {

    UNSAFE_componentWillMount() {
        this.props.loadUserDetail();
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={withRouter(Home)} />
                        <Route exact path="/terms" component={TermsAndConditions} />
                        <Route exact path="/service" component={TermsAndService} />
                        <Route exact path="/cookie" component={Cookie} />
                        <Route exact path="/privacy" component={Privacy} />
                        <Route exact path="/acceptable" component={AcceptableUse} />
                        <LoggedInRoute exact path="/notifications" component={NotificationPage} />
                        <LoggedInRoute exact path="/messages" component={MessagePage} />
                        <LoggedInRoute exact path="/company" component={CompanyPage} />
                        <LoggedInRoute exact path="/my-search" component={MySearch} />
                        <LoggedInRoute exact path="/my-search-records" component={SearchRecords} />
                        <LoggedInRoute exact path="/my-listings" component={MyListingsOld} />
                        <LoggedInRoute exact path="/my-listing-record" component={ListingRecord} />
                        <LoggedInRoute exact path="/statistics" component={Statistics} />
                        <LoggedInRoute exact path="/my-deliveries" component={MyDeliveries} />
                        {/*<LoggedInRoute exact path="/my-products" component={Products} />*/}
                        <LoggedInRoute exact path="/my-products" component={ProductsNew} />
                        <LoggedInRoute exact path="/products-service" component={ProductsService} />
                        <LoggedInRoute exact path="/approve" component={Approvals} />
                        <LoggedInRoute exact path="/approved" component={ApprovedReleases} />
                        <LoggedInRoute exact path="/register-record" component={RegisterRecord} />
                        <LoggedInRoute exact path="/service-agent-record" component={ServiceAgentRecord} />
                        <LoggedInRoute exact path="/issues" component={Issues} />
                        <LoggedInRoute exact path="/issue/:issueKey" component={IssueDetail} />
                        <LoggedInRoute exact path="/product-archive" component={ProductArchive} />
                        <LoggedInRoute exact path="/product-tracked" component={TrackedProducts} />
                        <LoggedInRoute exact path="/loops" component={Loops} />
                        <LoggedInRoute exact path="/my-cycles" component={MyCycles} />
                        <LoggedInRoute exact path="/create-search" component={CreateSearchHome} />
                        <LoggedInRoute exact path="/create-listing" component={CreateListingHome} />
                        <LoggedInRoute exact path="/search-form" component={SearchForm} />
                        <LoggedInRoute exact path="/list-form" component={ListForm} />

                        <LoggedInRoute exact path="/add-detail" component={AddDetail} />
                        <LoggedInRoute
                            exact
                            path="/delivery-resource"
                            component={DeliveryResource}
                        />
                        <LoggedInRoute exact path="/code" component={CycleCode} />
                        <LoggedInRoute exact path="/find-resources" component={FindResourcePage} />
                        <LoggedInRoute exact path="/resource/:slug" component={ResourceItem} />
                        <LoggedInRoute exact path="/account" component={MyAccount} />
                        <LoggedInRoute exact path="/payment" component={PaymentMethod} />
                        <LoggedInRoute exaedit-accountct path="/edit-account" component={EditAccount} />
                        <LoggedInRoute exact path="/company-info" component={CompanyInfo} />
                        <LoggedInRoute exact path="/addresses" component={Address} />
                        <LoggedInRoute exact path="/resources" component={BrowseResources} />
                        <LoggedInRoute exact path="/search/:slug" component={ViewSearchNew} />
                        <LoggedInRoute exact path="/search" component={Search} />
                        <LoggedInRoute exact path="/filter" component={Filter} />
                        <LoggedInRoute exact path="/loop-converted/:slug" component={LoopDetail} />
                        <LoggedInRoute exact path="/product/:slug" component={Product} />
                        <LoggedInRoute
                            exact
                            path="/sub-product-view/:slug"
                            component={SubProductView}
                        />
                        {/*<LoggedInRoute exact path="/product-view/:slug" component={ProductView} />*/}
                        <LoggedInRoute
                            exact
                            path="/message-seller/:slug"
                            component={MessageSeller}
                        />
                        <LoggedInRoute exact path="/matches/:slug" component={SearchMatches} />
                        <LoggedInRoute exact path="/make-offer/:slug" component={SearchMatches} />
                        <Route exact path="/p/:slug" component={ItemCycleDetail} />
                        <LoggedInRoute exact path="/matched/:match" component={ItemDetailMatched} />
                        <LoggedInRoute
                            exact
                            path="/match/:search/:listing"
                            component={ItemDetailMatch}
                        />
                        <LoggedInRoute exact path="/testing" component={ProductTreeView} />
                        <LoggedInRoute exact path="/:slug" component={ItemDetail} />
                        <LoggedInRoute exact path="/cycle/:slug" component={ViewCycle} />
                        <LoggedInRoute exact path="/:slug/:search" component={ItemDetail} />
                        <Route component={NotFound} />
                    </Switch>

                    {this.props.showLoginPopUp && <LoginPopUp />}
                    {this.props.showProductPopUp && <ProductPopUp />}
                    <CustomSnackbar />
                </BrowserRouter>
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
        userDetail: state.userDetail,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        showProductPopUp: state.showProductPopUp,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

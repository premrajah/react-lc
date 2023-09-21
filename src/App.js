import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./css/style.css";
import {BrowserRouter, Route, Switch, withRouter} from "react-router-dom";
import Home from "./pages/home/Home";
import LoginPopUp from "./views/login/LoginPopUp";
import CompanyPage from "./views/loop-cycle/company-page";
import MySearch from "./pages/search/MySearch";
import MyListings from "./pages/listings/MyListings";
import ItemDetail from "./pages/listings/ItemDetail";
import ItemCycleDetail from "./views/browse-resources/ItemCycleDetail";
import ProductsNew from "./pages/my-products/ProductsNew";
import Product from "./pages/product-detail/Product";
import ProductView from "./pages/product-detail/Product";
import ProductsService from "./pages/my-products/ProductsService";
import MyDeliveries from "./views/loop-cycle/MyDeliveries";
import Statistics from "./views/loop-cycle/Statistics";
import Loops from "./views/loop-cycle/Loops";
import MyCycles from "./pages/cycles/MyCycles";
import LoopDetail from "./views/loop-cycle/LoopDetail";
import ViewCycle from "./views/loop-cycle/view-cycle";
import CreateSearchHome from "./pages/create-search/Home";
import CreateListingHome from "./views/create-listing/Home";
import SubProductView from "./views/create-listing/SubProductView";
import SearchForm from "./pages/create-search/SearchFormPage";
import ViewSearchNew from "./pages/create-search/ViewSearch";
import SearchMatches from "./pages/create-search/search-matches";
import AddDetail from "./pages/create-search/AddDetail";
import DeliveryResource from "./views/delivery-resource/index";
import CycleCode from "./views/delivery-resource/CycleCode";
import MessageSeller from "./views/browse-resources/message-seller";
import ItemDetailMatch from "./pages/create-search/ItemDetailMatch";
import ItemDetailMatched from "./pages/create-search/ItemDetailMatched";
import Search from "./views/browse-resources/Search";
import Filter from "./views/browse-resources/Filter";
import LoggedInRoute from "./Util/LoggedInRoute";
import {connect} from "react-redux";
import * as actionCreator from "./store/actions/actions";
import EditAccount from "./pages/account/EditAccount";
import CompanyInfo from "./pages/account/CompanyInfo";
import PaymentMethod from "./pages/account/PaymentMethod";
import MyAccount from "./pages/account/MyAccount";
import ProductPopUp from "./views/create-product/create-product-popup";
import NotFound from "./views/NotFound/index";
import TermsAndConditions from "./components/Terms/TermsAndConditions";
import Cookie from "./components/Terms/Cookie";
import Privacy from "./components/Terms/Privacy";
import AcceptableUse from "./components/Terms/AcceptableUse";
import TermsAndService from "./components/Terms/TermsAndService";
import FindResourcePage from "./pages/marketplace/FindResourcePage";
import ProductArchive from "./pages/my-products/ProductArchive";
import ProductTreeView from "./components/ProductTreeView";
import Approvals from "./pages/approvals/Approvals";
import Issues from "./pages/issues/Issues";
import IssueDetail from "./pages/issues/IssueDetail";
import ApprovedReleases from "./pages/approvals/ApprovedReleases";
import NotificationPage from "./components/Inbox/NotificationPage";
import MessagePage from "./pages/message/MessagePage";
import TrackedProducts from "./pages/my-products/TrackedProducts";
import CustomSnackbar from "./components/UIComponents/CustomSnackbar";
import ResourceItem from "./components/Resources/ResourceItem";
import RegisterRecord from "./views/approvals/RegisterRecord";
import ServiceAgentRecord from "./views/approvals/ServiceAgentRecord";
import ListingRecord from "./pages/listings/ListingRecord";
import SignUpPage from "./pages/sign-up/SignUpPage";
import LoginPage from "./pages/login/LoginPage";
import LoggedOutRoute from "./Util/LoggedOutRoute";
import ForgotPasswordPage from "./pages/forgot-password/ForgotPasswordPage";
import Site from "./pages/site-detail/Site";
import SiteForm from "./components/Sites/SiteForm";
import CyclesRecords from "./pages/cycles/CyclesRecords";
import UploadMultiplePopUp from "./components/Products/UploadMultiplePopUp";
import TransferScaling from "./pages/account/TransferScaling";
import MyCampaigns from "./pages/ad-campaigns/MyCampaigns";

import {createTheme, ThemeProvider} from '@mui/material/styles';
import SearchRecords from "./pages/search/SearchRecords";
import ListFormNew from "./pages/create-listing/ListFormPage";

// Added by Chandan For Google Analytics
// Refer: https://github.com/react-ga/react-ga for usage details
// --- START
import ReactGA from 'react-ga';
import {gaTID, REACT_APP_BRANCH_ENV} from "./Util/Constants";
import RouteChangeTracker from './RouteChangeTracker'
import Help from "./pages/help/Help";
import CompanyDetailsPopUp from "./components/Account/CompanyDetailsPopUp";
import MyDiary from "./pages/diary/MyDiary";
import RentalReleaseRecords from "./pages/approvals/RentalReleaseRecords";
import PromptLoginRoute from "./Util/PromptLoginRoute";
import ProductsCondensedView from "./pages/my-products/ProductsCondensedView";
import TestRoute from "./components/TestRoute";
import SitesNew from "./pages/sites/SitesNew";
import VerifyEmail from "./pages/account/VerifyEmail";
import DocumentPortal from './components/Portal/DocumentPortal';
import ProductKinds from "./pages/product-kind/ProductKinds";
import ProductKindDetail from "./pages/product-kind/ProductKindDetail";
import CreateCollection from "./pages/collections/CreateCollection";
import CollectionDetail from "./pages/collections/CollectionDetail";


ReactGA.initialize(gaTID);
ReactGA.ga('set', 'appName', "loop-react-ui-" + REACT_APP_BRANCH_ENV);
ReactGA.pageview(window.location.pathname + window.location.search );
// --- END

const theme = createTheme({
    palette: {

        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#27245C',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },

        secondary: {
            // light: '#0066ff',
            main: '#D31169',
            // dark: will be calculated from palette.secondary.main,
            // contrastText: '#ffcc00',
        },


    },
});


class App extends Component {

    UNSAFE_componentWillMount() {
        this.props.loadUserDetail();
        this.props.userContext();

    }

    render() {
        return (
            <>
                <ThemeProvider theme={theme}>
                <BrowserRouter>
                    {/*<Header />*/}
                    <Switch>
                        <Route exact path="/" component={withRouter(Home)} />
                        <Route exact path="/test-route" component={TestRoute} />
                        <Route exact path="/terms" component={TermsAndConditions} />
                        <Route exact path="/service" component={TermsAndService} />
                        <Route exact path="/cookie" component={Cookie} />
                        <Route exact path="/privacy" component={Privacy} />
                        <Route exact path="/acceptable" component={AcceptableUse} />
                        <Route exact path="/verify" component={VerifyEmail} />
                        <LoggedInRoute exact path="/notifications" component={NotificationPage} />
                        <LoggedInRoute exact path="/messages" component={MessagePage} />
                        <LoggedInRoute exact path="/company" component={CompanyPage} />
                        <LoggedInRoute exact path="/my-search" component={MySearch} />
                        <LoggedInRoute exact path="/search-records" component={SearchRecords} />
                        <LoggedInRoute exact path="/my-listings" component={MyListings} />
                        <LoggedInRoute exact path="/my-listing-record" component={ListingRecord} />
                        <LoggedInRoute exact path="/statistics" component={Statistics} />
                        <LoggedInRoute exact path="/my-deliveries" component={MyDeliveries} />
                        {/*<LoggedInRoute exact path="/my-products" component={Products} />*/}
                        <LoggedInRoute exact path="/my-products" component={ProductsNew} />
                        <LoggedInRoute exact path="/product-kinds" component={ProductKinds} />
                        <LoggedInRoute exact path="/my-products/:id" component={ProductsNew} />
                        <LoggedInRoute exact path="/my-products-condensed" component={ProductsCondensedView} />
                        {/*<LoggedInRoute exact path="/sites" component={Sites} />*/}
                        <LoggedInRoute exact path="/sites" component={SitesNew} />
                        <LoggedInRoute exact path="/products-service" component={ProductsService} />
                        <LoggedInRoute exact path="/approve" component={Approvals} />
                        <LoggedInRoute exact path="/approved" component={ApprovedReleases} />
                        <LoggedInRoute exact path="/rental-records" component={RentalReleaseRecords} />
                        <LoggedInRoute exact path="/register-record" component={RegisterRecord} />
                        <LoggedInRoute exact path="/service-agent-record" component={ServiceAgentRecord} />
                        <LoggedInRoute exact path="/issues" component={Issues} />
                        <LoggedInRoute exact path="/issue/:issueKey" component={IssueDetail} />
                        <LoggedInRoute exact path="/product-archive" component={ProductArchive} />
                        <LoggedInRoute exact path="/product-tracked" component={TrackedProducts} />
                        <LoggedInRoute exact path="/loops" component={Loops} />
                        <LoggedInRoute exact path="/my-cycles" component={MyCycles} />
                        <LoggedInRoute exact path="/my-diary" component={MyDiary} />
                        <LoggedInRoute exact path="/cycles-record" component={CyclesRecords} />
                        <LoggedInRoute exact path="/create-search" component={CreateSearchHome} />
                        <LoggedInRoute exact path="/create-listing" component={CreateListingHome} />
                        <LoggedInRoute exact path="/search-form" component={SearchForm} />
                        <LoggedInRoute exact path="/list-form" component={ListFormNew} />
                        <LoggedInRoute exact path="/my-campaigns" component={MyCampaigns} />
                        <LoggedInRoute exact path="/add-detail" component={AddDetail} />
                        <LoggedInRoute exact path="/delivery-resource" component={DeliveryResource} />
                        <LoggedOutRoute exact path="/sign-up" component={SignUpPage} />
                        <LoggedOutRoute exact path="/login" component={LoginPage} />
                        <LoggedOutRoute exact path="/forgot-password" component={ForgotPasswordPage} />
                        <LoggedInRoute exact path="/code" component={CycleCode} />
                        <Route exact path="/find-resources" component={FindResourcePage} />
                        <LoggedInRoute exact path="/resource/:slug" component={ResourceItem} />
                        <PromptLoginRoute exact path="/account" component={MyAccount} />
                        <LoggedInRoute exact path="/help" component={Help} />
                        <LoggedInRoute exact path="/payment" component={PaymentMethod} />
                        <LoggedInRoute exact path="/edit-account" component={EditAccount} />
                        <LoggedInRoute exact path="/company-info" component={CompanyInfo} />
                        <LoggedInRoute exact path="/transfer-scaling" component={TransferScaling} />
                        <LoggedInRoute exact path="/search/:slug" component={ViewSearchNew} />
                        <LoggedInRoute exact path="/search" component={Search} />
                        <LoggedInRoute exact path="/create-collection" component={CreateCollection} />
                        <LoggedInRoute exact path="/filter" component={Filter} />
                        <LoggedInRoute exact path="/loop-converted/:slug" component={LoopDetail} />
                        <LoggedInRoute exact path="/product/:slug" component={ProductView} />
                        <LoggedInRoute exact path="/product-kind/:slug" component={ProductKindDetail} />
                        <LoggedInRoute exact path="/collection/:slug" component={CollectionDetail} />
                        <LoggedInRoute exact path="/product/preview/:slug" component={Product} />
                        <Route exact path="/p/:slug" component={ItemCycleDetail} />
                        <Route exact path="/ps/:slug" component={Site} />
                        <LoggedInRoute
                            exact
                            path="/sub-product-view/:slug"
                            component={SubProductView}
                        />
                        <LoggedInRoute
                            exact
                            path="/message-seller/:slug"
                            component={MessageSeller}
                        />
                        <LoggedInRoute exact path="/matches/:slug" component={SearchMatches} />
                        <LoggedInRoute exact path="/make-offer/:slug" component={SearchMatches} />
                        <LoggedInRoute exact path="/cycle/:slug" component={ViewCycle} />
                        <LoggedInRoute exact path="/matched/:match" component={ItemDetailMatched} />
                        <LoggedInRoute
                            exact
                            path="/match/:search/:listing"
                            component={ItemDetailMatch}
                        />
                        <Route exact path="/marketplace/:slug" component={ItemDetail} />
                        <Route exact path="/documents-portal" component={DocumentPortal} />
                        <LoggedInRoute exact path="/testing" component={ProductTreeView} />
                        <LoggedInRoute exact path="/:slug" component={ItemDetail} />
                        <LoggedInRoute exact path="/:slug/:search" component={ItemDetail} />
                        <Route component={NotFound} />

                    </Switch>

                    {this.props.showLoginPopUp && <LoginPopUp />}
                    {this.props.showProductPopUp && <ProductPopUp />}
                    {this.props.isLoggedIn&& <SiteForm />}
                        <UploadMultiplePopUp />
                    {this.props.firstLogin&&<CompanyDetailsPopUp />}
                    <CustomSnackbar />
                    {/*// Added by Chandan For Google Analytics*/}
                    {/*// Refer: https://github.com/react-ga/react-ga for usage details*/}
                    {/*// --- START*/}
                    <RouteChangeTracker />
                    {/*// -- END*/}
                </BrowserRouter>
                </ThemeProvider>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        orgCache: state.orgCache,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        showProductPopUp: state.showProductPopUp,
        showSiteForm: state.showSiteForm,
        showMultiplePopUp: state.showMultiplePopUp,
        firstLogin:state.firstLogin
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        userContext: (data) => dispatch(actionCreator.userContext(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

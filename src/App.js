import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'
import './css/style.css';
// import './css/style-2.scss';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, withRouter,  BrowserRouter } from "react-router-dom";

import Home from "./views/LoopHome/Home";
import Inbox from "./views/inbox/index";
import Login from "./views/login/Login";
import Account from "./views/loop-cycle/Account";
import Listings from "./views/loop-cycle/Listings";
import MySearch from "./views/loop-cycle/MySearch";

import ViewSearch from "./views/loop-cycle/ViewSearch";
import ViewSearchPage from "./views/loop-cycle/ViewSearchPage";
import MyListings from "./views/loop-cycle/MyListings";
import ItemDetail from "./views/loop-cycle/ItemDetail";
import Products from "./views/loop-cycle/Products";
import MyDeliveries from "./views/loop-cycle/MyDeliveries";
import Statistics from "./views/loop-cycle/Statistics";
import Loops from "./views/loop-cycle/Loops";
import LoopDetail from "./views/loop-cycle/LoopDetail";
import CreateSearchHome from "./views/create-search/Home";
import CreateListingHome from "./views/create-listing/Home";
import ListingForm from "./views/create-listing/ListingForm";
import SearchForm from "./views/create-search/SearchForm";
import AddDetail from "./views/create-search/AddDetail";
import DeliveryResource from "./views/delivery-resource/index";
import CycleCode from "./views/delivery-resource/CycleCode";
import BrowseResources from "./views/browser-resources/index";
import Search from "./views/browser-resources/Search";
import Filter from "./views/browser-resources/Filter";



// import Music from "./views/music";
// import Legacy from "./views/legacy";
// import Merch from "./views/merch";
// import Diary from "./views/diary";
// import TeamSandlas from "./views/team";



var hist = createBrowserHistory();

class App extends Component{

    constructor(props) {
        super(props)

    }

    render() {


        return (
            <>
                <BrowserRouter>
                {/*<Router history={hist}>*/}
                    <Switch>
                        <Route exact path="/" component={withRouter(Home)} />
                        <Route exact path="/inbox" component={withRouter(Inbox)} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/account" component={Account} />
                        <Route exact path="/listings" component={Listings} />
                        <Route exact path="/my-search" component={MySearch} />
                        <Route exact path="/view-search" component={ViewSearch} />
                        <Route exact path="/view-search-page" component={ViewSearchPage} />
                        <Route exact path="/my-listings" component={MyListings} />
                        <Route exact path="/item-detail" component={ItemDetail} />
                        <Route exact path="/statistics" component={Statistics} />
                        <Route exact path="/my-deliveries" component={MyDeliveries} />
                        <Route exact path="/products" component={Products} />
                        <Route exact path="/loops" component={Loops} />
                        <Route exact path="/loop-detail" component={LoopDetail} />
                        <Route exact path="/create-search" component={CreateSearchHome} />
                        <Route exact path="/create-listing" component={CreateListingHome} />
                        <Route exact path="/search-form" component={SearchForm} />
                        <Route exact path="/listing-form" component={ListingForm} />
                        <Route exact path="/add-detail" component={AddDetail} />
                        <Route exact path="/delivery-resource" component={DeliveryResource} />
                        <Route exact path="/code" component={CycleCode} />
                        <Route exact path="/browse" component={BrowseResources} />
                        <Route exact path="/search" component={Search} />
                        <Route exact path="/filter" component={Filter} />


                        {/*<Route exact path="/legacy" component={Legacy} />*/}
                        {/*<Route exact path="/merch" component={Merch} />*/}
                        {/*<Route exact path="/diary" component={Diary} />*/}
                        {/*<Route exact path="/team-sandlas" component={TeamSandlas} />*/}


                    </Switch>
                {/*</Router>*/}
                </BrowserRouter>
            </>
        );

    }
}

export default App;

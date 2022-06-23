import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import {makeStyles} from "@mui/styles";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {Modal, ModalBody} from "react-bootstrap";
import {withStyles} from "@mui/styles/index";
import TextField from "@mui/material/TextField";
import MatchItemSeller from "../../components/MatchItemSeller";
import NotFound from "../../views/NotFound";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import MoreMenu from "../../components/MoreMenu";
import ListEditForm from "../../components/Listings/ListEditForm";
import Layout from "../../components/Layout/Layout";
import OrgComponent from "../../components/Org/OrgComponent";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import InfoTabContent from "../../components/Listings/InfoTabContent";
import {GoogleMap} from "../../components/Map/MapsContainer";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import ListingDetail from "../../components/Listings/ListingDetail";

class ItemDetail extends Component {
    slug;
    search;
    marketplace
    constructor(props) {
        super(props);

        this.state = {

        };
        this.slug = props.match.params.slug;
        this.marketplace=props.match.path.includes("marketplace")?"marketplace":"my-listings"
        this.search = props.match.params.search;
    }

    componentDidMount() {

        window.scrollTo(0, 0);

    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>

                        <>
                          <ListingDetail
                              type={"detail"}
                              hideMatchesTab={this.marketplace=="marketplace"}
                                         marketplace={this.marketplace}
                                         search={this.search}
                                         listingId={this.slug}  />
                        </>


            </Layout>
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
export default connect(mapStateToProps, mapDispachToProps)(ItemDetail);

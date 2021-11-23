import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import AppBar from "@mui/material/AppBar";
import { makeStyles } from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from "../create-search/ResourceItem";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { withStyles } from "@mui/styles/index";
import ProductBlue from "../../img/icons/product-128.svg";
import PageHeader from "../../components/PageHeader";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";

class MyListings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
        };

        this.getItems = this.getItems.bind(this);
        this.callBackResult = this.callBackResult.bind(this);
    }

    callBackResult(action) {
        this.getItems();
    }

    componentDidMount() {
        this.getItems();
    }

    getItems() {
        this.props.showLoading(true);
        axios
            .get(`${baseUrl}listing`)
            .then(
                (response) => {

                    this.props.showLoading(false);

                    this.setState({
                        items: response.data.data,
                    });
                },
                (error) => {
                    console.log("listing error ", error.message)
                    this.props.showLoading(false);
                }
            );
    }



    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ProductBlue}
                            pageTitle="Listings"
                            subTitle="All your created listings can be found here. You can accept or decline a match to complete a loop"
                        />

                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/my-listing-record" className="btn btn-sm blue-btn mr-2">
                                    Listing Record
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />
                            </div>
                        </div>

                        <div className={"listing-row-border "}></div>

                        <div className="row  justify-content-center filter-row    pt-3 pb-2">
                            <div className="col-6">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {this.state.items.length} Listings
                                </p>
                            </div>

                            <div style={{ textAlign: "right" }} className="text-mute col-2 pl-0">
                                <span style={{ fontSize: "18px" }}>Price</span>
                            </div>

                            <div style={{ textAlign: "right" }} className="text-mute col-2 pl-0">
                                <span style={{ fontSize: "18px" }}>Status</span>
                            </div>
                            <div style={{ textAlign: "right" }} className="text-mute col-2 pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>

                        <div className={"listing-row-border mb-3"}></div>

                        {this.state.items.filter(l => l.listing.stage !== "agreed" && l.listing.stage !== "complete").map((item, index) => (
                            <>
                                <ResourceItem
                                    triggerCallback={() => this.callBackResult()}
                                    history={this.props.history}
                                    link={"/" + item.listing._key}
                                    item={item}
                                    key={index}
                                />
                            </>
                        ))}
                    </div>

                    <React.Fragment>
                        <CssBaseline />

                        <AppBar
                            position="fixed"
                            style={{backgroundColor: "#ffffff"}}
                            className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>
                                <div
                                    className="row  justify-content-center search-container "
                                    style={{ margin: "auto" }}>
                                    <div className="col-auto">
                                        <Link to={"/list-form"}>
                                            <p className={"green-text bottom-bar-text"}>

                                                <b>Create a Listing</b>
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </Toolbar>
                        </AppBar>
                    </React.Fragment>
                </div>
            </div>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function SearchField() {
    const classes = useStylesTabs();

    return (
        <CustomizedInput
            className={" full-width-field"}
            id="input-with-icon-textfield"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
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
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MyListings);

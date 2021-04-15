import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from "../create-search/ResourceItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles/index";
import ProductBlue from "../../img/icons/product-128.svg";
import PageHeader from "../../components/PageHeader";

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
        var url = baseUrl + "listing";

        this.props.showLoading(true);

        axios
            .get(url, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.props.showLoading(false);

                    this.setState({
                        items: responseAll,
                    });
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }

    componentWillMount() {}

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
                            pageTitle="My Listings"
                            subTitle="Accept or decline a match to start a loop."
                        />

                        <div className="row  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchField />
                            </div>
                        </div>

                        <div className={"listing-row-border "}></div>

                        <div className="row  justify-content-center filter-row    pt-3 pb-2">
                            <div className="col-6">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {this.state.items.length} Listings{" "}
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

                        {this.state.items.map((item) => (
                            <>
                                <ResourceItem
                                    triggerCallback={() => this.callBackResult()}
                                    history={this.props.history}
                                    link={"/" + item.listing._key}
                                    item={item}
                                />
                            </>
                        ))}
                    </div>

                    <React.Fragment>
                        <CssBaseline />

                        <AppBar
                            position="fixed"
                            color="#ffffff"
                            className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>
                                <div
                                    className="row  justify-content-center search-container "
                                    style={{ margin: "auto" }}>
                                    <div className="col-auto">
                                        <Link to={"/list-form"}>
                                            <p className={"green-text bottom-bar-text"}>
                                                {" "}
                                                Create New Listing{" "}
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
        <TextField
            variant="outlined"
            className={clsx(classes.margin, classes.textField) + " full-width-field"}
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
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MyListings);

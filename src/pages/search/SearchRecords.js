import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import SearchIcon from "../../img/icons/search-128px.svg";
import { Link } from "react-router-dom";
import HeaderDark from "../../views/header/HeaderDark";
import Sidebar from "../../views/menu/Sidebar";
import AppBar from "@mui/material/AppBar";
import { makeStyles } from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import {baseUrl, LISTING_FILTER_VALUES} from "../../Util/Constants";
import axios from "axios/index";
import SearchItem from "../../components/Searches/search-item";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { withStyles } from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import Layout from "../../components/Layout/Layout";
import SearchBar from "../../components/SearchBar";

class SearchRecords extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            items: [],
            searchValue: '',
            filterValue: '',
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

    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }

    getItems() {
        this.props.showLoading(true);
        axios
            .get(`${baseUrl}search/expand`)
            .then(
                (response) => {
                    this.setState({items: response.data.data,});
                    this.props.showLoading(false);
                },
                (error) => {
                    this.props.showLoading(false);
                }
            );
    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>
                <div className="container  pb-4 pt-4">
                    <PageHeader
                        subTitle="All your searches records can be found here. "
                        pageTitle="Search Records"
                        pageIcon={SearchIcon}
                    />
                    <div className="row ">
                        <div className="col-12 d-flex justify-content-start">
                            <Link to="/my-search" className="btn btn-sm btn-gray-border">
                                Searches
                            </Link>
                        </div>
                    </div>
                    <div className="row pt-3 justify-content-center search-container   ">
                        <div className={"col-12"}>
                            <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={LISTING_FILTER_VALUES} />
                        </div>
                    </div>
                    <div className="row  justify-content-center filter-row  pt-3 pb-3">
                        <div className="col">
                            <p  className="text-gray-light ml-2 ">
                                {this.state.items&&this.state.items.filter((site)=>
                                    this.state.filterValue?( this.state.filterValue==="name"?
                                        site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                        this.state.filterValue==="product name"? site.product&&site.product.name
                                            &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                            null):
                                        (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                            site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                        )

                                ).filter(l => l.search.stage.toLowerCase() !== "agreed" && l.search.stage !== "expired").length

                                }
                                <span className="ml-1 text-gray-light"> Search Found</span>
                            </p>
                        </div>


                    </div>

                    {this.state.items&&this.state.items.filter((site)=>
                        this.state.filterValue?( this.state.filterValue==="name"?
                            site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                            this.state.filterValue==="product name"? site.product&&site.product.name
                                &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()): null):
                            (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                            )

                    ).filter(l => l.search.stage.toLowerCase() === "agreed" || l.search.stage === "expired").map((item, index) => (
                        <SearchItem
                            showMoreMenu={true}
                            triggerCallback={() => this.callBackResult()}
                            item={item}
                            key={index}
                        />
                    ))}
                </div>
            </Layout>
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
export default connect(mapStateToProps, mapDispachToProps)(SearchRecords);

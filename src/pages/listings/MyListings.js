import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchGray from "@mui/icons-material/Search";
import {baseUrl, LISTING_FILTER_VALUES} from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from "../create-search/ResourceItem";
import {withStyles} from "@mui/styles/index";
import ProductBlue from "../../img/icons/product-128.svg";
import PageHeader from "../../components/PageHeader";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import Layout from "../../components/Layout/Layout";
import SearchBar from "../../components/SearchBar";

class MyListings extends Component {
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

    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>
                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={ProductBlue}
                            pageTitle="Listings"
                            subTitle="All your listings can be found here. You can accept or decline a match to start a loop"
                        />

                        <div className="row ">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/my-listing-record" className="btn btn-sm btn-gray-border">
                                    Listing Record
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container  pt-3 ">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={LISTING_FILTER_VALUES} />
                            </div>
                        </div>


                        <div className="row  justify-content-center filter-row  pt-3 pb-3">
                            <div className="col">
                                <p  className="text-gray-light ml-2 ">
                                    {this.state.items&&this.state.items.filter((site)=>
                                        this.state.filterValue?( this.state.filterValue==="name"?
                                            site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                            this.state.filterValue==="product name"? site.product.name
                                                &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                                null):
                                            (site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                               )

                                    ).filter(l => l.listing.stage.toLowerCase() !== "agreed" ).length

                                    }
                                    <span className="ml-1 text-gray-light"> Listing Found</span>
                                </p>
                            </div>


                        </div>



                            {this.state.items&&this.state.items.filter((site)=>
                                    this.state.filterValue?( this.state.filterValue==="name"?
                                        site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                        this.state.filterValue==="product name"? site.product.name
                                            &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                            null):
                                        (site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                            site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                        )

                                ).filter(l => l.listing.stage.toLowerCase() !== "agreed").map((item, index) => (
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

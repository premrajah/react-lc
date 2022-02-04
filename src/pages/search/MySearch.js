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
import {baseUrl, LISTING_FILTER_VALUES, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import axios from "axios/index";
import SearchItem from "../../components/Searches/search-item";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { withStyles } from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import CustomizedInput from "../../components/FormsUI/ProductForm/CustomizedInput";
import Layout from "../../components/Layout/Layout";
import SearchBar from "../../components/SearchBar";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {createSeekURL, seekAxiosGet} from "../../Util/GlobalFunctions";

class MySearch extends Component {
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


    clearList=()=>{

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
    }

    setFilters=(data)=>{

        let filters= []
        let subFilter=[]

        let searchValue= data.searchValue
        let activeFilter= data.filterValue

        if (searchValue){

            if (activeFilter){

                subFilter.push({key:activeFilter, value:"%" + searchValue + "%", operator:"~"})

            }else{

                PRODUCTS_FILTER_VALUES_KEY.forEach((item)=>
                    subFilter.push({key:item.key, value:"%" + searchValue + "%", operator:"~"})
                )


            }
        }


        filters.push({filters:subFilter,operator:"||"})


        this.filters= filters

    }

    seekCount=async () => {

        let url = createSeekURL("search", false, true, null, null,
            this.filters, "AND")


        let result = await seekAxiosGet(url)



        this.setState({
            count: result.data.data,

        })



    }

    loadPageWise= async (data) => {

        console.log(data)

        if (data.reset){

            this.clearList()
        }
        this.setFilters(data)

        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset


        let url = createSeekURL("search", false, false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND","")

        let result = await seekAxiosGet(url)


        if (result && result.data && result.data.data) {

            this.state.offset= newOffset + this.state.pageSize

            this.setState({
                items: this.state.items.concat(result.data.data),
                loadingResults: false,
                lastPageReached: (result.data.data.length === 0 ? true : false),
                offset: newOffset + this.state.pageSize

            })
        }else{

            if (result) {
                this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})

                this.setState({

                    loadingResults: false,

                })

            }
        }

        // console.log(result)


    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <Layout>
                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            subTitle="All your searches can be found here. You can accept or decline a match to start a loop"
                            pageTitle="Searches"
                            pageIcon={SearchIcon}
                        />
                        <div className="row ">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/search-records" className="btn btn-sm btn-gray-border">
                                    Search Records
                                </Link>
                            </div>
                        </div>
                        <div className="row d-none pt-3 justify-content-center search-container   ">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={LISTING_FILTER_VALUES} />
                            </div>
                        </div>
                        <div className="row d-none justify-content-center filter-row  pt-3 pb-3">
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
                        <PaginationLayout

                            dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={this.loadPageWise} >

                        {this.state.items
                            .map((item, index) => (
                            <SearchItem
                                showMoreMenu={true}
                                triggerCallback={() => this.callBackResult()}
                                item={item}
                                key={index}
                            />
                        ))}
                        </PaginationLayout>
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MySearch);

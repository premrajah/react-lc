import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import clsx from "clsx";
import RingBlue from "../../img/icons/ring-blue.png";
import {makeStyles} from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchGray from "@mui/icons-material/Search";
import axios from "axios/index";
import {baseUrl, CYCLE_FILTER_VALUES} from "../../Util/Constants";
import CycleItem from "../../components/Cycles/CycleItem";
import PageHeader from "../../components/PageHeader";
import {Link} from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout/Layout";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";

class MyCycles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            nextIntervalFlag: false,
            loops: [],
            searchValue: '',
            filterValue: '',
            items:[],
            lastPageReached:false,
            currentOffset:0,
            productPageSize:50,
            loadingResults:false,
            count:0
        };

        this.getCycles = this.getCycles.bind(this);
    }

    getCycles() {
        let newOffset=this.state.currentOffset

        this.props.showLoading(true);

        axios
            // .get(baseUrl + "cycle/expand")
            .get(`${baseUrl}cycle/expand?offset=${this.state.currentOffset}&size=${this.state.productPageSize}`)

            .then(
                (response) => {

                    this.setState({
                        items:this.state.items.concat(response.data.data),
                        loadingResults:false,
                        lastPageReached:(response.data.data.length===0?true:false),
                        currentOffset:newOffset+this.state.productPageSize
                    });

                    this.props.showLoading(false);
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }


    componentDidMount() {
        this.setState({
            items:[]
        })
        this.getTotalCount()
    }

    getTotalCount=()=>{

        axios
            // .get(`${baseUrl}product/no-parent/no-links`)
            .get(`${baseUrl}cycle/count`)
            .then(
                (response) => {
                    if(response.status === 200) {

                        this.setState({
                            count:(response.data.data),

                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });



    }
    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }

    render() {
        return (
            <Layout>


                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={RingBlue}
                            pageTitle="Cycles"
                            subTitle="Cycles are your transactions in progress. View your created cycles here"
                        />

                        <div className="row mb-3 text-left">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/cycles-record" className="btn btn-sm btn-gray-border">
                                    Cycles Record
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container   ">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={CYCLE_FILTER_VALUES} />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row  pt-2 pb-2">
                            <div className="col">
                                <p  className="text-gray-light ml-2 ">
                                   Showing {this.state.items&&this.state.items.filter((site)=>
                                        this.state.filterValue?( this.state.filterValue==="search name"?
                                            site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                            this.state.filterValue==="product name"? site.product&&site.product.name &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="listing name"? site.listing&&site.listing.name &&site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                                null):
                                            (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                            )

                                    ).filter(l => l.cycle.stage.toLowerCase() !== "closed").length

                                    }
                                    <span className="ml-1 text-gray-light"> of {this.state.count} Cycles</span>
                                </p>
                            </div>


                        </div>

                        <PaginationLayout loadingResults={this.state.loadingResults} lastPageReached={this.state.lastPageReached} loadMore={this.getCycles} >


                        {this.state.items&&this.state.items.filter((site)=>
                            this.state.filterValue?( this.state.filterValue==="search name"?
                                site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="product name"? site.product&&site.product.name &&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                    this.state.filterValue==="listing name"? site.listing&&site.listing.name &&site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):

                                        null):
                                (site.search.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||site.listing.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.product&& site.product.name&&site.product.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
                                )

                        ).filter(l => l.cycle.stage.toLowerCase() !== "closed"&&l.cycle.stage.toLowerCase() !== "settled").map((item, index) => (
                            <CycleItem item={item} key={index} />
                        )) }

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
export default connect(mapStateToProps, mapDispachToProps)(MyCycles);
